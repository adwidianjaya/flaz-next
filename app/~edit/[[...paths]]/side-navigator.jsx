"use client";

import { cn } from "@/lib/utils";
import { useSchema } from "@/lib/json-render/ui/store";
import { useMemo } from "react";

export const SideNavigator = () => {
  const [schema] = useSchema();
  const schemaStringified = useMemo(() => {
    // console.log({ schema });
    return JSON.stringify(schema, null, 2);
  }, [schema]);

  return (
    <div className="h-full overflow-y-scroll bg-gray-100">
      <div className="sticky top-0 left-0 z-10 px-2 py-1 mb-1 text-xs bg-gray-600 text-white">
        Schema
      </div>
      <div
        className={cn(
          "whitespace-pre font-mono text-xs px-2 py-1",
          "text-gray-600 hover:text-black transition duration-100",
        )}
      >
        {schemaStringified}
      </div>
    </div>
  );
};
