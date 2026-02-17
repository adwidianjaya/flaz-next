"use client";

import { useRef, useState } from "react";
import { ArrowRightCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSignalEffect, signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { For } from "@preact/signals-react/utils";

const messages = signal([]);

const UIPrompter = () => {
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
    while (true) {
      const { value, done } = await reader.read();
      // console.log({ value, done });

      if (done) {
        messages.value = [...messages.value, value];
        break;
      }

      let lines = value.split("\n");
      for (let index = 0; index < lines.length; index++) {
        const line = lines[index];
        lastLine += line;

        if (index < lines.length - 1) {
          messages.value = [...messages.value, String(lastLine || "").trim()];

          lastLine = "";
        }
      }
    }

    if (lastLine) {
      messages.value = [...messages.value, String(lastLine || "").trim()];
    }
  };

  return (
    <div className="flex h-full border-b border-t border-gray-700">
      <div className="w-1/4 flex flex-col">
        <div className="h-full"></div>
        <div className="h-32 flex-none border-t border-gray-700 flex flex-col">
          <textarea
            value={prompt}
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
      </div>

      <div className={cn("w-3/4 flex flex-col", "border-l border-gray-700")}>
        <div className="h-full"></div>
        <div className="h-32 flex-none border-t border-gray-700">
          <LogView />
        </div>
      </div>
    </div>
  );
};

export { UIPrompter };

const LogView = () => {
  useSignals();

  const logViewContainer = useRef(null);
  useSignalEffect(() => {
    // We access .value to ensure this effect subscribes to changes in the 'messages' signal
    const count = messages.value.length;
    // console.log("...count", count);
    if (!count) {
      return;
    }

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
  });

  return (
    <div
      ref={logViewContainer}
      className="w-full h-full outline-0 text-sm px-3 py-2 overflow-y-scroll"
    >
      <For
        each={messages}
        fallback={<div className="text-gray-600">Log view is empty.</div>}
      >
        {(message, index) => {
          // console.log({ message });
          return <div key={index}>{message}</div>;
        }}
      </For>
    </div>
  );
};
