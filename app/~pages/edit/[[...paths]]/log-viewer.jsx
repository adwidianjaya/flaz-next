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
        "h-32 flex-none border-t border-r border-b border-gray-300 overflow-y-scroll font-mono text-xs bg-gray-100",
        logs.length > 0
          ? "text-gray-500 hover:text-gray-400 transition duration-100"
          : "text-gray-500",
      )}
    >
      <div className="sticky top-0 z-10 bg-gray-600 text-white px-2 py-1 mb-1">
        Logs
      </div>
      {!logs?.length ? (
        <div className="py-1 px-4">No logs yet...</div>
      ) : (
        logs.map((log, index) => {
          return (
            <div
              key={index}
              className={cn(
                "rounded-sm py-0.5 px-2 shadow",
                log.operation?.op === "add" &&
                  "hover:bg-gray-300 text-gray-600",
                log.operation?.op === "remove" &&
                  "hover:bg-orange-200 text-orange-600",
                log.operation?.op === "replace" &&
                  "hover:bg-purple-200 text-purple-600",
                log.operation?.op === "info" &&
                  "hover:bg-blue-200 text-blue-600 py-1 mb-2",
                log.operation?.op === "error" &&
                  "hover:bg-red-200 text-red-600 py-1 mb-2",
              )}
            >
              {log.message}
            </div>
          );
        })
      )}
    </div>
  );
};
