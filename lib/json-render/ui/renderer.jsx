"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import { useDefinition, useSchema, useStates } from "./store";
import { convertDefinitionToRenderSchema } from "../utils";
import * as modules from "../catalog/components/modules";
import { SimpleTemplatingEngine } from "../template-engine.js";
import { capitalize, isString, set, upperFirst } from "lodash-es";

const RendererContext = createContext();

export const useRendererContext = () => {
  return useContext(RendererContext);
};

export const RendererProvider = ({ initialDefinition, children }) => {
  const [schema, schemaAction] = useSchema();
  const [definition, definitionAction] = useDefinition();
  useEffect(() => {
    if (!initialDefinition) {
      return;
    }
    // console.log({ initialDefinition });

    let initialSchema = convertDefinitionToRenderSchema({
      definition: initialDefinition,
      initialStates: {},
    });
    definitionAction.setDefinition(initialDefinition);
    schemaAction.setSchema(initialSchema);
  }, [initialDefinition]);

  return (
    <RendererContext.Provider value={{ schema, definition }}>
      {children}
    </RendererContext.Provider>
  );
};

export const Renderer = ({}) => {
  const [schema] = useSchema();
  // console.log({ schema });

  return schema?.elements?.map((element, index) => {
    return <Element key={element.type + index} element={element} />;
  });
};

const NotFound = ({ type }) => {
  return (
    <div
      role="alert"
      style={{
        border: "1px solid #ef4444",
        background: "#fef2f2",
        color: "#b91c1c",
        borderRadius: "6px",
        padding: "8px 10px",
        fontSize: "12px",
        margin: "4px 0",
      }}
    >
      {`Error: no module type "${type}"`}
    </div>
  );
};

const Element = ({ element }) => {
  const type = element?.type ?? "unknown";
  const Component = modules[type];
  if (!Component) {
    return <NotFound type={type} />;
  }
  // console.log({ element, Component });

  const props = createReactiveProps(element.props || {});
  const children = element.children;

  // if (type === "TextInput") {
  //   console.log({ props, children });
  // }

  return (
    <Component {...props} reactiveProps={props}>
      {children?.map((element, index) => {
        return <Element key={element.type + index} element={element} />;
      })}
    </Component>
  );
};

const createReactiveProps = (elementProps) => {
  const [states, statesAction] = useStates();

  const reactiveProps = {};

  const bindingPaths = useMemo(() => new Map(), []);
  const reactiveKeys = Object.keys(elementProps || {});

  for (const reactiveKey of reactiveKeys) {
    // 1. Determine and cache the binding path if it's a string binding.
    let bindingPath = bindingPaths.get(reactiveKey);
    if (
      typeof elementProps[reactiveKey] === "string" &&
      elementProps[reactiveKey].startsWith("{$states.") &&
      elementProps[reactiveKey].endsWith("}") &&
      !bindingPath
    ) {
      const match = elementProps[reactiveKey].match(/\{\$states\.([^\s?}]*)/);
      const result = match[1];
      // console.log({ result });
      bindingPath = result;
      bindingPaths.set(reactiveKey, bindingPath); // Cache the binding path
    }

    // console.log("...reactiveKey", reactiveKey, bindingPath);

    let newValue;
    let propValue = elementProps[reactiveKey] || "";
    if (isString(propValue)) {
      try {
        newValue = SimpleTemplatingEngine.render(propValue, states || {});
      } catch (error) {
        console.warn(
          `Error handling template for key '${reactiveKey}':`,
          error,
        );
        newValue = propValue; // Fallback to raw prop value on error
      }
    } else {
      newValue = propValue;
    }

    if (reactiveKey === "value") {
      console.log("...get", reactiveKey, { newValue });
    }
    reactiveProps[reactiveKey] = newValue;

    if (bindingPath) {
      reactiveProps["onChange" + upperFirst(reactiveKey)] = function (value) {
        if (reactiveKey === "value") {
          console.log("...set", bindingPath, value);
        }
        statesAction.setStatesByPath(bindingPath, value);
      };
    }
  }

  // console.log({ reactiveProps });
  return reactiveProps;
};
