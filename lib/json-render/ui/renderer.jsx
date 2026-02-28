"use client";

import { createContext, useContext, useEffect } from "react";
import { useDefinition, useSchema } from "./store";
import { convertDefinitionToRenderSchema } from "../utils";
import * as modules from "../catalog/components/modules";

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

  const props = element.props || {};
  const children = element.children;
  // console.log({ props, children });

  return (
    <Component {...props}>
      {children?.map((element, index) => {
        return <Element key={element.type + index} element={element} />;
      })}
    </Component>
  );
};
