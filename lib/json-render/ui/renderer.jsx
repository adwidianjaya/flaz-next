"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import { store, useDefinition, useSchema } from "./store";
import { useSnapshot } from "valtio";
import { convertDefinitionToRenderSchema } from "../utils";
import * as modules from "../catalog/components/modules";
import { SimpleTemplatingEngine } from "../template-engine.js";
import { isString, set, upperFirst } from "lodash-es";

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
  const props = useReactiveProps(element.props || {});
  const children = element.children;

  const type = element?.type ?? "unknown";
  const Component = modules[type];
  if (!Component) {
    return <NotFound type={type} />;
  }
  // console.log({ element, Component });

  // if (type === "TextInput") {
  //   console.log({ props, children, states });
  // }

  return (
    <Component {...props} reactiveProps={props}>
      {children?.map((element, index) => {
        return <Element key={element.type + index} element={element} />;
      })}
    </Component>
  );
};

const useReactiveProps = (elementProps = {}) => {
  const allStatePaths = useMemo(
    () => extractStatePaths(Object.values(elementProps)),
    [elementProps],
  );
  // const commonPath = useMemo(
  //   () => resolveCommonPath(allStatePaths),
  //   [allStatePaths],
  // );

  const storeToSnapshot = useMemo(() => {
    // return !commonPath || !allStatePaths.length
    //   ? store.undefined
    //   : store.states;

    return !allStatePaths.length ? store.undefined : store.states;
  }, [
    // commonPath,
    allStatePaths,
  ]);

  const states = useSnapshot(storeToSnapshot);
  // console.log({
  //   values: Object.values(elementProps),
  //   allStatePaths,
  //   commonPath,
  //   storeToSnapshot,
  //   states,
  // });

  const reactiveProps = useMemo(
    () => createReactiveProps(elementProps, states),
    [states, elementProps],
  );
  return reactiveProps;
};

const createReactiveProps = (elementProps, states) => {
  const reactiveProps = {};

  const bindingPaths = new Map();
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
    const propValue = elementProps[reactiveKey];
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

    // if (reactiveKey === "value") {
    //   console.log("...get", reactiveKey, { newValue });
    // }
    reactiveProps[reactiveKey] = newValue;

    if (bindingPath) {
      reactiveProps["onChange" + upperFirst(reactiveKey)] = function (value) {
        if (reactiveKey === "value") {
          // console.log("...set", bindingPath, value);
        }
        set(store.states, bindingPath, value);
      };
    }
  }

  // console.log({ reactiveProps });
  return reactiveProps;
};

// ─── Utilities ───────────────────────────────────────────────────────────────────
function resolveCommonPath(paths) {
  if (!paths?.length) return "";

  // Normalize '?.' to '.' for comparison, but remember original separators
  const normalize = (p) => p.replace(/\?\./g, ".");

  let prefix = normalize(paths[0]);
  const normalizedPaths = [prefix];

  for (let i = 1; i < paths.length; i++) {
    normalizedPaths.push(normalize(paths[i]));
  }

  for (let i = 1; i < normalizedPaths.length && prefix; i++) {
    const current = normalizedPaths[i];
    const max = Math.min(prefix.length, current.length);
    let j = 0;
    while (j < max && prefix[j] === current[j]) j++;

    if (j === prefix.length && j === current.length) {
      const last = prefix.lastIndexOf(".");
      prefix = last === -1 ? "" : prefix.slice(0, last);
      continue;
    }

    const lastDot = prefix.lastIndexOf(".", j - 1);
    prefix = lastDot === -1 ? "" : prefix.slice(0, lastDot);
  }

  // Restore '?.' in output by matching against original first path
  return restoreSeparators(paths[0], prefix);
}

function restoreSeparators(original, normalizedResult) {
  if (!normalizedResult) return "";
  // Walk the original path and rebuild up to the same length
  let result = "";
  let ni = 0; // index into normalizedResult
  for (let i = 0; i < original.length && ni < normalizedResult.length; i++) {
    if (original[i] === "?" && original[i + 1] === ".") {
      result += "?.";
      i++; // skip '.'
      ni++; // skip '.' in normalized
    } else {
      result += original[i];
      ni++;
    }
  }
  return result;
}

function extractStatePaths(paths) {
  // Match $states followed by a chain of .prop, [index], ["key"], ['key']
  const stateRegex =
    /\$states((?:\.[a-zA-Z_$][a-zA-Z0-9_$]*|\[(?:\d+|[a-zA-Z_$][a-zA-Z0-9_$]*|["'][^"']*["'])\])+)/g;

  const seen = new Set();
  const results = [];

  let match;
  while ((match = stateRegex.exec(paths)) !== null) {
    const chain = match[1]; // e.g. .user["last name"].length
    const transformed = transformChain(chain);

    if (!seen.has(transformed)) {
      seen.add(transformed);
      results.push(transformed);
    }
  }

  return results;
}

function transformChain(chain) {
  // Tokenize the chain into segments
  const tokenRegex =
    /\.([a-zA-Z_$][a-zA-Z0-9_$]*)|\[(\d+|[a-zA-Z_$][a-zA-Z0-9_$]*|["'][^"']*["'])\]/g;

  const tokens = [];
  let token;
  while ((token = tokenRegex.exec(chain)) !== null) {
    if (token[1] !== undefined) {
      tokens.push({ type: "dot", key: token[1] });
    } else {
      tokens.push({ type: "bracket", key: token[2] });
    }
  }

  return tokens
    .map((t, i) => {
      const isFirst = i === 0;
      if (t.type === "dot") {
        // First segment: no optional chaining prefix
        return isFirst ? t.key : `?.${t.key}`;
      } else {
        // Bracket: [0], [varName], ["spaced key"]
        return isFirst ? `[${t.key}]` : `?.[${t.key}]`;
      }
    })
    .join("");
}
