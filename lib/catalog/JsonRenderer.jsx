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

const normalizeStatePath = (path = "") =>
  String(path || "")
    .replace(/^\/states\/?/, "")
    .split("/")
    .filter(Boolean)
    .join(".");

const resolveFormatPart = (part, states) => {
  if (typeof part === "string" && part.startsWith("/states/")) {
    return lodashGet(states, normalizeStatePath(part), "");
  }

  if (part && typeof part === "object" && typeof part.$state === "string") {
    return lodashGet(states, normalizeStatePath(part.$state), "");
  }

  return part ?? "";
};

const resolveProps = ({ props = {}, states, updateStatesByPath }) => {
  const result = {};

  for (const key of Object.keys(props)) {
    const value = props[key];

    if (value && typeof value === "object" && typeof value.$bind === "string") {
      const bindPath = normalizeStatePath(value.$bind);
      result[key] = lodashGet(states, bindPath, "");
      result.onChangeValue = (nextValue) => {
        updateStatesByPath(bindPath, nextValue);
      };
      continue;
    }

    if (value && typeof value === "object" && Array.isArray(value.$format)) {
      result[key] = value.$format
        .map((part) => resolveFormatPart(part, states))
        .join("");
      continue;
    }

    result[key] = value;
  }

  return result;
};

const Element = ({ type, props, children }) => {
  const Component = Components[type];

  const states = useStatesStore((state) => state.states);
  const updateStatesByPath = useStatesStore((state) => state.updateStatesByPath);
  const normalizedProps = resolveProps({ props, states, updateStatesByPath });

  if (!Component) {
    return errorBoundaryFallbackRender({
      error: {
        message: `Unknown component type: ${type}`,
      },
    });
  }

  return (
    <ErrorBoundary fallbackRender={errorBoundaryFallbackRender}>
      <Component {...normalizedProps}>
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
  }, [states, initStates]);

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
