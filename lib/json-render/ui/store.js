import { initDefinition } from "@/lib/json-render/utils";
import { proxy, useSnapshot, subscribe, snapshot } from "valtio";
import { deepClone } from "valtio/utils";
import { set } from "lodash-es";

export const store = proxy({
  definition: initDefinition(),
  schema: {},
  logs: [],
  loading: false,
  selectedElement: null,
  activeTab: "schema",
  //
  // real states
  states: {},
  //
  // undefined placeholder for nothing reactive
  undefined: {},
});
// subscribe(store, () => {
//   console.log("store has changed to", store.schema, store.logs.length, "logs");
// });

export const useDefinition = () => {
  const snap = useSnapshot(store);

  return [
    snap.definition,
    {
      setDefinition: (definition) => {
        // console.log("...setDefinition", definition);
        store.definition = deepClone({ ...definition });
      },
    },
  ];
};

export const useSchema = () => {
  const snap = useSnapshot(store);

  return [
    snap.schema,
    {
      setSchema: (schema) => {
        // console.log("...setSchema", schema);
        store.schema = deepClone({ ...schema });
        store.states = deepClone({ ...schema.states });
      },
    },
  ];
};

export const useLogs = () => {
  const snap = useSnapshot(store);

  return [snap.logs, { appendLog: (log) => store.logs.push(log) }];
};

export const useSelectedElement = () => {
  const snap = useSnapshot(store);

  return [
    snap.selectedElement,
    {
      setSelectedElement: (element) => {
        store.selectedElement = element ? deepClone(element) : null;
        if (element) {
          store.activeTab = "props";
        }
      },
      clearSelectedElement: () => {
        store.selectedElement = null;
      },
      updateSelectedElementProp: (key, value) => {
        if (store.selectedElement && store.selectedElement.props) {
          store.selectedElement.props[key] = value;
          if (store.schema.elements) {
            const schemaElement = store.schema.elements.find(
              (el) => el.elementId === store.selectedElement.elementId
            );
            if (schemaElement && schemaElement.props) {
              schemaElement.props[key] = value;
            }
          }
        }
      },
    },
  ];
};

export const useActiveTab = () => {
  const snap = useSnapshot(store);

  return [
    snap.activeTab,
    {
      setActiveTab: (tab) => {
        store.activeTab = tab;
      },
    },
  ];
};
