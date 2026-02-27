"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRightCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  initDefinition,
  updateDefinitionByOperationString,
  convertDefinitionToRenderStructure,
} from "@/lib/json-render";
import { JsonRenderer } from "@/lib/catalog/JsonRenderer";

const sanitizePathForQuery = (routePath) => encodeURIComponent(routePath || "/");

const parseOperation = (line) => {
  try {
    return JSON.parse(line);
  } catch {
    return null;
  }
};

const toRenderSchema = (definition) => {
  const result = convertDefinitionToRenderStructure({
    definitionReferences: definition,
  });

  return {
    elements: result?.elements || [],
    states: result?.states || {},
  };
};

const EditorClient = ({ routePath, initialPage }) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [definition, setDefinition] = useState(initialPage?.definition || initDefinition());
  const [pageName, setPageName] = useState(String(initialPage?.name || ""));
  const [schema, setSchema] = useState(() => toRenderSchema(initialPage?.definition || initDefinition()));
  const [prompt, setPrompt] = useState(
    'create form for event registration "CoolinerRun". put image on the left https://images.unsplash.com/photo-1758684051112-3df152ce3256?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  );
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingName, setSavingName] = useState(false);

  const logOutputRef = useRef(null);

  useEffect(() => {
    setCurrentPage(initialPage);
    setDefinition(initialPage?.definition || initDefinition());
    setPageName(String(initialPage?.name || ""));
    setSchema(toRenderSchema(initialPage?.definition || initDefinition()));
    setLogs([]);
  }, [initialPage]);

  useEffect(() => {
    if (!logOutputRef.current) return;
    requestAnimationFrame(() => {
      if (!logOutputRef.current) return;
      logOutputRef.current.scrollTo({
        top: logOutputRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [logs.length]);

  const pageTitle = useMemo(() => {
    const name = String(pageName || "").trim();
    return name ? `Flaz | ${name}` : "Flaz";
  }, [pageName]);

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const saveCurrentPage = async (nextDefinition, nextName) => {
    const response = await fetch(`/api/page?path=${sanitizePathForQuery(routePath)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ definition: nextDefinition, name: nextName }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save page: ${response.status}`);
    }

    const payload = await response.json();
    if (payload?.page) {
      setCurrentPage(payload.page);
    }
  };

  const applyOperationLine = (line, workingDefinition) => {
    const trimmed = String(line || "").trim();
    if (!trimmed) return workingDefinition;

    const operation = parseOperation(trimmed);
    setLogs((previous) => [...previous, { operation, message: trimmed }]);

    const nextDefinition = updateDefinitionByOperationString({
      operationString: trimmed,
      definition: workingDefinition,
    });

    setDefinition(nextDefinition);
    setSchema(toRenderSchema(nextDefinition));
    return nextDefinition;
  };

  const handleSendPrompt = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch("/api/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, context: { ...definition } }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Prompt request failed: ${response.status}`);
      }

      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

      let lastLine = "";
      let workingDefinition = { ...definition };

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const lines = String(value || "").split("\n");
        for (let index = 0; index < lines.length; index += 1) {
          lastLine += lines[index];
          if (index < lines.length - 1) {
            workingDefinition = applyOperationLine(lastLine, workingDefinition);
            lastLine = "";
          }
        }
      }

      if (String(lastLine || "").trim()) {
        workingDefinition = applyOperationLine(lastLine, workingDefinition);
      }

      await saveCurrentPage(workingDefinition, pageName.trim());
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setLogs((previous) => [...previous, { operation: { op: "error" }, message }]);
    }

    setLoading(false);
  };

  const handleSaveName = async () => {
    if (savingName || loading) return;

    setSavingName(true);
    try {
      await saveCurrentPage(definition, pageName.trim());
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setLogs((previous) => [...previous, { operation: { op: "error" }, message }]);
    }
    setSavingName(false);
  };

  return (
    <div className="flex flex-col w-full h-dvh">
      <div className="w-full py-3 px-4 bg-slate-200 flex items-center justify-between gap-4">
        <div className="italic font-semibold">Flaz</div>

        <div className="pb-1 flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-700">Name:</span>
            <input
              value={pageName}
              placeholder="Page name"
              disabled={loading || savingName}
              onChange={(event) => setPageName(event.target.value)}
              className={cn(
                "rounded border px-2 py-1 text-xs outline-none",
                "disabled:opacity-60 disabled:cursor-not-allowed",
              )}
            />
            <button
              type="button"
              onClick={handleSaveName}
              disabled={loading || savingName}
              className="rounded border bg-white px-2 py-1 text-xs hover:bg-slate-100 disabled:opacity-60"
            >
              {savingName ? "Saving..." : "Save"}
            </button>
          </div>

          <span className="text-xs text-gray-700 whitespace-nowrap">
            Path: <code>{currentPage?.path || routePath || "/"}</code>
          </span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className={cn("w-1/4 flex flex-col", "border-b border-t border-gray-200")}>
          <div className="h-full overflow-y-scroll bg-stone-100">
            <div className="sticky top-0 left-0 z-10 px-2 py-1 mb-1 text-xs bg-gray-600 text-white">Schema</div>
            <pre
              className={cn(
                "whitespace-pre-wrap font-mono text-xs px-2 py-1",
                "text-gray-600 hover:text-black transition duration-100",
              )}
            >
              {JSON.stringify(schema, null, 2)}
            </pre>
          </div>

          <div className="h-32 flex-none border-t border-gray-300 flex flex-col bg-gray-100">
            <textarea
              value={prompt}
              placeholder="Talk to Flaz here..."
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleSendPrompt();
                }
              }}
              onChange={(event) => setPrompt(event.target.value)}
              className={cn(
                "w-full h-full outline-0 text-sm px-3 py-2",
                loading && "animate-pulse pointer-events-none text-gray-500",
              )}
            />
            <div className="text-right flex-none bg-gray-100">
              <button
                type="button"
                onClick={handleSendPrompt}
                disabled={loading}
                className={cn(
                  "px-2 py-1 cursor-pointer",
                  "text-gray-600 hover:text-gray-400",
                  "transition duration-100",
                  loading && "opacity-50",
                )}
              >
                <ArrowRightCircleIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className={cn("w-3/4 flex flex-col bg-slate-50", "border-b border-t border-l border-gray-200")}>
          <div className="w-full h-full text-xs overflow-scroll">
            <div className="sticky top-0 z-10 bg-gray-600 text-white px-2 py-1 mb-1 text-xs">Preview</div>
            <div className="px-3 py-2">
              <JsonRenderer states={schema.states} elements={schema.elements} />
            </div>
          </div>

          <div
            ref={logOutputRef}
            className={cn(
              "h-32 flex-none border-t border-r border-b border-gray-300 overflow-y-scroll font-mono text-xs bg-gray-100",
              logs.length > 0
                ? "text-gray-500 hover:text-gray-400 transition duration-100"
                : "text-gray-500",
            )}
          >
            <div className="sticky top-0 z-10 bg-gray-600 text-white px-2 py-1 mb-1">Logs</div>
            {logs.length ? (
              logs.map((log, index) => (
                <div
                  key={`${index}-${log.message}`}
                  className={cn(
                    "rounded-sm py-0.5 px-2 shadow",
                    log.operation?.op === "add" && "hover:bg-gray-300 text-gray-600",
                    log.operation?.op === "remove" && "hover:bg-orange-200 text-orange-600",
                    log.operation?.op === "replace" && "hover:bg-purple-200 text-purple-600",
                    log.operation?.op === "info" && "hover:bg-blue-200 text-blue-600 py-1 mb-2",
                    log.operation?.op === "error" && "hover:bg-red-200 text-red-600 py-1 mb-2",
                  )}
                >
                  {log.message}
                </div>
              ))
            ) : (
              <div className="py-1 px-4">No logs yet...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorClient;
