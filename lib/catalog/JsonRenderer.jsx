import { ErrorBoundary } from "react-error-boundary";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { set as lodashSet, get as lodashGet } from "lodash-es";

import Button from "./components/button";
import Card from "./components/card";
import Container from "./components/container";
import Text from "./components/text";
import ShortTextInput from "./components/short-text-input";
import { useEffect } from "react";

const Components = {
  Button,
  Card,
  Container,
  Text,
  ShortTextInput,
};

const errorBoundaryFallbackRender = ({ error, resetErrorBoundary }) => (
  <div className="py-2 px-3 bg-red-700 rounded my-2 mx-2">
    <div className="font-bold">Error rendering</div>
    <div className="text-xs mt-1 italic">{error.message}</div>
  </div>
);

const useStatesStore = create(
  immer((set) => {
    return {
      states: {},
      //
      initStates: (states) =>
        set((state) => {
          state.states = states;
        }),
      updateStatesByPath: (path, value) =>
        set((state) => {
          lodashSet(state.states, path, value);
        }),
    };
  }),
);

const Element = ({ type, props, children }) => {
  const Component = Components[type];
  // console.log({ type, Component });

  if (!Component) {
    return errorBoundaryFallbackRender({
      error: {
        message: `Unknown component type: ${type}`,
      },
    });
  }

  const states = useStatesStore((state) => state.states);

  return (
    <ErrorBoundary fallbackRender={errorBoundaryFallbackRender}>
      <Component {...props}>
        {children?.map((element, index) => {
          return <Element key={index} {...element} />;
        })}
      </Component>
    </ErrorBoundary>
  );
};

const JsonRenderer = ({ elements = [], states = {} }) => {
  const initStates = useStatesStore((state) => state.initStates);
  useEffect(() => {
    // console.log("...initStates", states);
    initStates({ ...states });
  }, [states]);

  // console.log({ elements });

  return (
    <>
      {elements?.map((element, index) => {
        return <Element key={index} {...element} />;
      })}
    </>
  );
};

export { JsonRenderer };
