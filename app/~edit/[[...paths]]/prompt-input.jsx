"use client";

import { CircleArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { useDefinition, useLogs, useSchema } from "@/lib/json-render/ui/store";
import {
  updateDefinitionByOperationString,
  convertDefinitionToRenderSchema,
} from "@/lib/json-render/utils";

import { saveCurrentPage } from "./action";

export const PromptInput = () => {
  const params = useParams();
  const [definition, definitionAction] = useDefinition();
  const [schema, schemaAction] = useSchema();
  const [_, logsAction] = useLogs();
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState(
    `create a form, input name, and phone number and output simple greeting. The greeting should be in the form of 'Hello, {name}!'. if name is empty, render "No Name" with orange text. then check name length, if above 10, render Name is too long. if name is "Adhe", render "Noice", else render the name`,
    // `create form for event registration "CoolinerRun". put image on the left https://images.unsplash.com/photo-1758684051112-3df152ce3256?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
  );
  const handleSendPrompt = async () => {
    setLoading(true);

    try {
      let currentDefinition = JSON.parse(JSON.stringify(definition));
      let currentSchema = JSON.parse(JSON.stringify(schema));

      let body = JSON.stringify({
        prompt,
        context: {
          ...currentDefinition,
        },
      });
      // prompt = "";
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
          break;
        }

        let lines = value.split("\n");
        for (let index = 0; index < lines.length; index++) {
          const line = lines[index];
          lastLine += line;

          if (index < lines.length - 1) {
            lastLine = String(lastLine).trim();

            const { operation, definition: newDefinition } =
              updateDefinitionByOperationString({
                operationString: lastLine,
                definition: currentDefinition,
              });
            currentDefinition = newDefinition;
            if (operation) {
              logsAction.appendLog({
                operation,
                message: lastLine,
              });
            }
            currentSchema = convertDefinitionToRenderSchema({
              definition: currentDefinition,
              initialStates: currentSchema.states,
            });

            lastLine = "";
          }
        }
      }

      lastLine = String(lastLine).trim();
      if (lastLine) {
        const { operation, definition: newDefinition } =
          updateDefinitionByOperationString({
            operationString: lastLine,
            definition: currentDefinition,
          });
        currentDefinition = newDefinition;
        if (operation) {
          logsAction.appendLog({
            operation,
            message: lastLine,
          });
        }
        currentSchema = convertDefinitionToRenderSchema({
          definition: currentDefinition,
          initialStates: currentSchema.states,
        });

        lastLine = "";
      }

      const path = ["", ...(params.paths || [])].join("/");
      await saveCurrentPage({
        name: "",
        path,
        schema: currentSchema,
        definition: currentDefinition,
      });
      definitionAction.setDefinition(currentDefinition);
      schemaAction.setSchema(currentSchema);
    } catch (err) {
      console.warn(err);
    }

    setLoading(false);
  };

  return (
    <div className="h-32 flex-none border-t border-gray-300 flex flex-col bg-gray-100">
      <textarea
        placeholder="Talk to Flaz here..."
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendPrompt?.();
            return;
          }
        }}
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value);
        }}
        className={cn(
          "w-full h-full outline-0 text-sm px-3 py-2",
          loading && "animate-pulse pointer-events-none text-gray-500",
        )}
      ></textarea>
      <div className="text-right flex-none bg-gray-100">
        <button
          type="button"
          onClick={handleSendPrompt}
          className={cn(
            "px-2 py-1 cursor-pointer",
            "text-gray-600 hover:text-gray-400",
            "transition duration-100",
          )}
        >
          <CircleArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
