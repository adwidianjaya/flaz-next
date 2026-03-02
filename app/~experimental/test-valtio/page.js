"use client";

import { Text } from "@/lib/json-render/catalog/components/modules";
import TextInput from "@/lib/json-render/catalog/components/text-input";
import { cn } from "@/lib/utils";
import { set } from "lodash-es";
import { proxy, useSnapshot } from "valtio";

// 1. Define your global state proxy OUTSIDE the components.
// This replaces your useState and Context entirely.
const store = proxy({
  counter: {
    count: 0,
  },
  status: {
    active: false,
  },
  history: [],
  //
  states: {
    name: "",
  },
});

const Page = () => {
  return (
    // Look how clean the parent component is now! No Providers needed.
    <div className="grid grid-cols-4 gap-4 container mx-auto py-8 w-full h-dvh">
      <div>
        <InputComponent />
        <OutputComponent />
      </div>
      <ComponentA />
      <ComponentB />
      <Componentc />
    </div>
  );
};

export default Page;

const InputComponent = () => {
  const snap = useSnapshot(store.counter);

  return (
    <TextInput
      label="Name"
      name="name"
      value={store.states.name}
      // value={snap.states.name}
      onChangeValue={(value) => {
        // console.log("...onChangeValue", value);
        store.states.name = value;
      }}
    />
  );
};

const OutputComponent = () => {
  const snap = useSnapshot(store);

  return <Text text={snap.states.name} />;
};

const ComponentA = () => {
  // We don't use `useSnapshot` here because this component only writes data.
  // Because it doesn't read the snapshot, Component A will NEVER re-render!

  return (
    <div className="p-8 text-center bg-red-200">
      <button
        type="button"
        className={cn(
          "bg-purple-500 text-white px-3 py-1",
          "shadow transform active:scale-95 active:shadow-none rounded cursor-pointer",
        )}
        onClick={() => {
          // Direct mutation! Valtio detects this and updates listeners automatically.

          // store.counter.count++;
          set(store.counter, "count", store.counter.count + 1);
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
          // No spread operators needed. Just flip the boolean.

          // store.status.active = !store.status.active;
          set(store.status, "active", !store.status.active);
        }}
      >
        Update Component C
      </button>
    </div>
  );
};

const ComponentB = () => {
  // 2. Read the state using useSnapshot.
  // Valtio tracks that we specifically look at `counter.count`.
  const snap = useSnapshot(store);

  return (
    <div className="p-8 text-center bg-purple-200">
      <div className="text-black text-xl">
        Count: <b>{snap.counter.count}</b>
      </div>
    </div>
  );
};

const Componentc = () => {
  // Valtio tracks that we specifically look at `status.active`.
  const snap = useSnapshot(store);

  return (
    <div
      className={cn(
        "p-8 text-center",
        !snap.status.active && "bg-blue-400",
        snap.status.active && "bg-blue-200",
      )}
    ></div>
  );
};
