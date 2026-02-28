"use client";

import { cn } from "@/lib/utils";
import { useDefinition, useSchema } from "@/lib/json-render/ui/store";
import { useEffect, useMemo } from "react";
import { convertDefinitionToRenderSchema } from "@/lib/json-render/utils";

export const SideNavigator = ({ initialDefinition }) => {
  const [schema, schemaAction] = useSchema();
  const schemaStringified = useMemo(() => {
    // console.log({ schema });
    return JSON.stringify(schema, null, 2);
  }, [schema]);

  const [definition, definitionAction] = useDefinition();
  useEffect(() => {
    if (!initialDefinition) {
      return;
    }

    // console.log({ initialDefinition });
    let initialSchema = convertDefinitionToRenderSchema({
      definition: initialDefinition,
      initialStates: {},
    });
    definitionAction.setDefinition(initialDefinition);
    schemaAction.setSchema(initialSchema);
  }, [initialDefinition]);

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
