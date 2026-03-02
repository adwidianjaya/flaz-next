import { merge, set, unset } from "lodash-es";

export const initDefinition = () => {
  return {
    root: "",
    states: {},
    elements: {},
  };
};

export const updateDefinitionByOperationString = ({
  operationString,
  definition,
}) => {
  let operation = null;
  let sanitizedString = operationString || "";
  try {
    if (sanitizedString.startsWith(`"\"`)) {
      sanitizedString = operationString.split(`"\"`).join(`"`);
    }
    if (sanitizedString.endsWith(`\""`)) {
      sanitizedString = operationString.split(`\""`).join(`"`);
    }
    operation = JSON.parse(sanitizedString);
  } catch (err) {
    console.warn("...error parsing operationString", err.message, {
      sanitizedString,
    });
  }
  // console.log(
  //   "\n...updateDefinition",
  //   color.yellow(JSON.stringify(operation, null, 2)),
  // );
  if (!operation || operation.op === "info" || operation.op === "error") {
    return { definition, operation };
  }

  if (operation.path.startsWith("$states")) {
    const path = operation.path
      .split("$states.")
      .join("")
      .trim()
      .split("/")
      .join(".");
    // console.log({ path });
    if (path === "$states") {
      if (operation.op === "remove") {
        definition.states = {};
      } else {
        definition.states = operation.value || {};
      }
    } else {
      if (operation.op === "remove") {
        unset(definition.states, path);
      } else {
        set(definition.states, path, operation.value);
      }
    }
  } else if (operation.path.startsWith("$elements")) {
    let path = operation.path.split("$elements.").join("").split("/").join(".");
    // console.log({ path, op: operation.op });
    if (path === "$elements") {
      definition.elements = {};
    } else {
      if (operation.op === "remove") {
        delete definition.elements[path];
      } else if (operation.op === "replace") {
        console.log("...replace", path, operation.value);
        const paths = path.split(".");
        if (
          !paths.includes("props") &&
          !path.endsWith("type") &&
          !path.endsWith("children")
        ) {
          paths.splice(paths.length - 1, 0, "props");
          path = paths.join(".");
        }
        set(definition.elements, path, operation.value);
      } else if (operation.op === "add") {
        const elementId = path;
        definition.elements[elementId] = operation.value;
      }
    }
  } else if (operation.path.startsWith("$root")) {
    definition.root = operation.value || "";
  }

  return { definition, operation };
};

const convertChildToRenderSchema = ({ element, definition, elementId }) => {
  if (!element) return null;

  let renderStructure = JSON.parse(JSON.stringify(element));
  renderStructure.elementId = elementId;

  if (renderStructure.children?.length > 0) {
    renderStructure.children = renderStructure.children
      .map((childId) => {
        return convertChildToRenderSchema({
          element: definition.elements[childId],
          definition,
          elementId: childId,
        });
      })
      .filter((child) => !!child);
  }

  return renderStructure;
};

export const convertDefinitionToRenderSchema = ({
  definition,
  initialStates = {},
}) => {
  // console.log("...convertDefinitionToRenderSchema", definition);
  if (!definition.root || !definition.elements[definition.root]) {
    return {
      elements: [],
      states: {},
    };
  }

  let schema = {
    elements: [
      convertChildToRenderSchema({
        element: definition.elements[definition.root],
        definition,
        elementId: definition.root,
      }),
    ],
    states: merge(JSON.parse(JSON.stringify(definition.states)), initialStates),
  };

  // console.log("...schema", schema);
  return schema;
};
