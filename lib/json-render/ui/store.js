import { initDefinition } from "@/lib/json-render/utils";
import { proxy, useSnapshot, subscribe } from "valtio";
import { deepClone } from "valtio/utils";
import { set } from "lodash-es";

export const store = proxy({
  definition: initDefinition(),
  schema: {},
  states: {},
  logs: [],
  loading: false,
});
// subscribe(store, () => {
//   console.log("store has changed to", store.schema, store.logs.length, "logs");
// });

export const useDefinition = () => {
  const definition = useSnapshot(store.definition);

  return [
    definition,
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

export const useStates = () => {
  const states = useSnapshot(store.states);

  return [
    states,
    {
      setStatesByPath: (path, value) => {
        // console.log("...setStatesByPath", path, value);
        set(store.states, path, value);
      },
    },
  ];
};

export const useLogs = () => {
  const logs = useSnapshot(store.logs);

  return [logs, { appendLog: (log) => store.logs.push(log) }];
};

export const useLoading = () => {
  const loading = useSnapshot(store.loading);

  return [
    loading,
    {
      setLoading: (loading) => {
        store.loading = loading;
      },
    },
  ];
};
