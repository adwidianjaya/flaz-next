"use client";

import { useEffect, useRef } from "react";

import { useLogs } from "@/lib/json-render/ui/store";
import { cn } from "@/lib/utils";

export const LogViewer = () => {
  const [logs] = useLogs();

  let logContainer = useRef(null);
  useEffect(() => {
    if (!logs.length) {
      return;
    }

    setTimeout(() => {
      logContainer.current.scrollTo({
        top: logContainer.current.scrollHeight, // Scrolls to the maximum height of the content
        behavior: "smooth", // Enables smooth scrolling animation
      });
    }, 500);
  }, [logs?.length]);

  return (
    <div
      ref={logContainer}
      className={cn(
        "h-40 flex-none border-t border-gray-200 bg-white",
        logs.length > 0 ? "text-gray-500" : "text-gray-500",
      )}
    >
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-5 py-3">
        <div className="text-sm font-semibold text-gray-900">Logs</div>
        <div className="text-xs text-gray-500">
          Operation history from prompt-based page edits.
        </div>
      </div>
      {!logs?.length ? (
        <div className="px-5 py-4 text-sm">No logs yet...</div>
      ) : (
        <div className="space-y-2 px-5 py-4 font-mono text-xs">
          {logs.map((log, index) => {
            return (
              <div
                key={index}
                className={cn(
                  "rounded-lg border px-3 py-2 shadow-xs transition",
                  log.operation?.op === "add" &&
                    "border-emerald-200 bg-emerald-50 text-emerald-700",
                  log.operation?.op === "remove" &&
                    "border-orange-200 bg-orange-50 text-orange-700",
                  log.operation?.op === "replace" &&
                    "border-blue-200 bg-blue-50 text-blue-700",
                  log.operation?.op === "info" &&
                    "border-slate-200 bg-slate-50 text-slate-700",
                  log.operation?.op === "error" &&
                    "border-red-200 bg-red-50 text-red-700",
                  !log.operation?.op &&
                    "border-gray-200 bg-gray-50 text-gray-600",
                )}
              >
                {log.message}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
