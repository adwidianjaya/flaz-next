"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRightCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { encode as toonEncode } from "@toon-format/toon";
import {
  initDefinition,
  updateDefinitionByOperationString,
  convertDefinitionToRenderStructure,
} from "@/lib/json-render";
import { JsonRenderer } from "@/lib/catalog/JsonRenderer";

const useDefinitionStore = create(
  immer((set) => {
    return {
      definition: initDefinition(),

      updateDefinition: (definition) =>
        set((state) => {
          state.definition = definition;
        }),
    };
  }),
);
const useStructureStore = create(
  immer((set) => {
    return {
      structure: {
        states: {},
        elements: [],
      },

      updateStructure: (structure) =>
        set((state) => {
          state.structure = structure;
        }),
    };
  }),
);
const useLogStore = create(
  immer((set) => {
    return {
      logs: [],

      addLog: (logMessage) =>
        set((state) => {
          state.logs.push(logMessage);
        }),
    };
  }),
);

const UIPrompter = () => {
  return (
    <>
      <div
        className={cn(
          "w-1/4 flex flex-col",
          "border-b border-t border-gray-700",
        )}
      >
        <StructureView />
        <PromptInput />
      </div>

      <div
        className={cn(
          "w-3/4 flex flex-col",
          "border-b border-t border-l border-gray-700",
        )}
      >
        <div className="w-full h-full text-xs px-3 py-2 overflow-scroll">
          <StructureRenderer />
        </div>
        <LogView />
      </div>
    </>
  );
};

export { UIPrompter };

const StructureView = () => {
  const structure = useStructureStore((state) => state.structure);
  const structureString = useMemo(() => {
    return JSON.stringify(structure, null, 4);
    // return toonEncode(structure);
  }, [structure]);

  return (
    <div className="w-full h-full overflow-scroll text-sm px-3 py-2 whitespace-pre font-mono">
      {structureString}
    </div>
  );
};

const PromptInput = () => {
  const { definition, updateDefinition } = useDefinitionStore();
  const updateStructure = useStructureStore((state) => state.updateStructure);
  const addLog = useLogStore((state) => state.addLog);

  const [prompt, setPrompt] = useState(
    "create form, input name, and output simple greeting. The greeting should be in the form of 'Hello, {name}!' with orange text.",
  );

  const sendPrompt = async () => {
    let body = JSON.stringify({ prompt });
    setPrompt("");
    const response = await fetch("/api/llm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    const reader = response.body
      ?.pipeThrough(new TextDecoderStream())
      .getReader();
    if (!reader) return;

    let lastLine = "";
    let currentDefinition = { ...definition };
    while (true) {
      const { value, done } = await reader.read();
      // console.log({ value, done });

      if (done) {
        addLog(value);
        // logs.value = produce(logs.value, (draft) => {
        //   draft.push(value);
        // });
        // logs.value = [...logs.value, value];
        break;
      }

      let lines = value.split("\n");
      for (let index = 0; index < lines.length; index++) {
        const line = lines[index];
        lastLine += line;

        if (index < lines.length - 1) {
          lastLine = String(lastLine || "").trim();
          addLog(lastLine);

          const newDefinition = updateDefinitionByOperationString({
            operationString: lastLine,
            definition: currentDefinition,
          });
          // updateDefinition(newDefinition);
          const newStructure = convertDefinitionToRenderStructure({
            definitionReferences: newDefinition,
          });
          updateStructure(newStructure);

          lastLine = "";
          currentDefinition = { ...newDefinition };
        }
      }
    }

    if (lastLine) {
      lastLine = String(lastLine || "").trim();
      addLog(lastLine);

      const newDefinition = updateDefinitionByOperationString({
        operationString: lastLine,
        definition: currentDefinition,
      });
      // updateDefinition(newDefinition);
      const newStructure = convertDefinitionToRenderStructure({
        definitionReferences: newDefinition,
      });
      updateStructure(newStructure);

      lastLine = "";
      currentDefinition = { ...newDefinition };
    }

    updateDefinition({ ...currentDefinition });
  };

  return (
    <div className="h-32 flex-none border-t border-gray-700 flex flex-col">
      <textarea
        value={prompt}
        placeholder="Talk to Flaz here..."
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendPrompt();
            return;
          }
        }}
        onChange={(e) => {
          setPrompt(e.target.value);
        }}
        className="w-full h-full outline-0 text-sm px-3 py-2"
      ></textarea>
      <div className="text-right flex-none">
        <button
          type="button"
          onClick={sendPrompt}
          className={cn(
            "px-2 pb-2 cursor-pointer",
            "text-gray-200 hover:text-gray-400",
            "transition duration-100",
          )}
        >
          <ArrowRightCircleIcon />
        </button>
      </div>
    </div>
  );
};

const LogView = () => {
  const logViewContainer = useRef(null);

  const logs = useLogStore((state) => state.logs);
  useEffect(() => {
    if (logViewContainer.current) {
      // Using requestAnimationFrame ensures the DOM has finished rendering
      // the new list items before we calculate the new scroll height.
      requestAnimationFrame(() => {
        logViewContainer.current.scrollTo({
          top: logViewContainer.current.scrollHeight,
          behavior: "smooth", // Change to "instant" if you want it snappier
        });
      });
    }
  }, [logs?.length]);

  return (
    <div
      ref={logViewContainer}
      className="h-32 flex-none border-t border-gray-700 text-sm px-3 py-2 overflow-y-scroll"
    >
      {logs.map((message, index) => {
        return <div key={index}>{message}</div>;
      })}
    </div>
  );
};

const StructureRenderer = () => {
  const structure = useStructureStore((state) => state.structure);

  return <JsonRenderer elements={structure?.elements || []} />;
};
