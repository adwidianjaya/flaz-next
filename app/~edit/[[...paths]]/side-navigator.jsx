"use client";

import { cn } from "@/lib/utils";
import { useSchema } from "@/lib/json-render/ui/store";
import { useMemo, useState } from "react";

export const SideNavigator = () => {
  const [schema] = useSchema();
  const [activeTab, setActiveTab] = useState("schema");

  const schemaStringified = useMemo(() => {
    return JSON.stringify(schema, null, 2);
  }, [schema]);

  return (
    <div className="h-full overflow-y-scroll bg-gray-100">
      <div className="flex sticky top-0 left-0 z-10 bg-gray-600">
        <button
          onClick={() => setActiveTab("schema")}
          className={cn(
            "px-3 py-1 text-xs font-medium transition duration-100",
            activeTab === "schema"
              ? "bg-gray-100 text-gray-900"
              : "text-white hover:bg-gray-500"
          )}
        >
          Schema
        </button>
        <button
          onClick={() => setActiveTab("props")}
          className={cn(
            "px-3 py-1 text-xs font-medium transition duration-100",
            activeTab === "props"
              ? "bg-gray-100 text-gray-900"
              : "text-white hover:bg-gray-500"
          )}
        >
          Props Editor
        </button>
      </div>
      {activeTab === "schema" && (
        <div
          className={cn(
            "whitespace-pre font-mono text-xs px-2 py-1",
            "text-gray-600 hover:text-black transition duration-100"
          )}
        >
          {schemaStringified}
        </div>
      )}
      {activeTab === "props" && (
        <div className="p-2 text-xs text-gray-600">
          Props Editor - Coming soon
        </div>
      )}
    </div>
  );
};
