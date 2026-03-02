"use client";

import { useState } from "react";
import { saveCurrentCollectionName } from "../../action";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

export const CollectionNameInput = ({
  collectionId,
  initialName,
  tableName,
}) => {
  const [name, setName] = useState(initialName || "");
  const [savedName, setSavedName] = useState(initialName || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async (nextName) => {
    if (nextName === savedName) return;

    setSaving(true);
    try {
      await saveCurrentCollectionName({
        name: nextName,
        collectionId,
      });
      setSavedName(nextName);
    } catch (error) {
      console.warn("Failed to save collection name", error);
    }
    setSaving(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
      <span>Collection:</span>
      <Popover>
        <PopoverTrigger asChild>
          <button className="cursor-pointer underline decoration-dashed underline-offset-4">
            {name || "Untitled collection"}
          </button>
        </PopoverTrigger>
        <PopoverContent className="p-3" align="start">
          <div className="mb-2 text-xs font-medium text-gray-500">
            Rename collection
          </div>
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            onBlur={() => handleSave(name)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.currentTarget.blur();
              }
            }}
            disabled={saving}
            placeholder="Collection name"
          />
        </PopoverContent>
      </Popover>
      <span className="text-gray-300">|</span>
      <span>Table:</span>
      <code className="rounded bg-white px-2 py-1 text-xs text-gray-700 shadow-xs">
        {tableName}
      </code>
    </div>
  );
};
