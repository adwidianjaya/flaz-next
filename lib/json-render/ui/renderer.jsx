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

const Element = ({ element }) => {
  const Component = modules[element.type];
  if (!Component) return null;
  // console.log({ element, Component });

  const props = element.props || [];
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
