"use client";

import { cn } from "@/lib/utils";
import { useSignal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { produce } from "immer";
import { createContext, useContext } from "react";

const StateContext = createContext(null);

const Page = () => {
  const localStates = {
    counter: useSignal({
      count: 0,
    }),
    status: useSignal({
      active: false,
    }),
    history: useSignal([]),
  };

  return (
    <StateContext.Provider value={{ localStates }}>
      <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto py-8 w-full h-dvh">
        <ComponentA />
        <ComponentB />
        <Componentc />
      </div>
    </StateContext.Provider>
  );
};

export default Page;

const ComponentA = () => {
  const { localStates } = useContext(StateContext);

  return (
    <div className="p-8 text-center bg-red-200">
      <button
        type="button"
        className={cn(
          "bg-purple-500 text-white px-3 py-1",
          "shadow transform active:scale-95 active:shadow-none rounded cursor-pointer",
        )}
        onClick={() => {
          const nextState = produce(localStates.counter.value, (draft) => {
            draft.count++;
          });
          localStates.counter.value = nextState;
        }}
      >
        Update Component B
      </button>
      <div>&nbsp;</div>
      <button
        type="button"
        className={cn(
          "bg-blue-500 text-white px-3 py-1",
          "shadow transform active:scale-95 active:shadow-none rounded cursor-pointer",
        )}
        onClick={() => {
          localStates.status.value = {
            ...localStates.status.value,
            active: !localStates.status.value.active,
          };
        }}
      >
        Update Component C
      </button>
    </div>
  );
};

const ComponentB = () => {
  useSignals();

  const { localStates } = useContext(StateContext);

  return (
    <div className="p-8 text-center bg-purple-200">
      <div className="text-black text-xl">
        Count: <b>{localStates.counter.value?.count}</b>
      </div>
    </div>
  );
};

const Componentc = () => {
  useSignals();
  const { localStates } = useContext(StateContext);

  return (
    <div
      className={cn(
        "p-8 text-center",
        !localStates.status.value?.active && "bg-blue-400",
        localStates.status.value?.active && "bg-blue-200",
      )}
    ></div>
  );
};
