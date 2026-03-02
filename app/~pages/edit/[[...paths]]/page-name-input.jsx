"use client";

import { useState } from "react";
import { saveCurrentPageName } from "../../action";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

export const PageNameInput = ({ initialName, path }) => {
  const [name, setName] = useState(initialName || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async (newName) => {
    // console.log({ initialName, newName });
    if (initialName === newName) return;

    setSaving(true);
    try {
      await saveCurrentPageName({
        name: newName,
        path,
      });
    } catch (err) {
      console.warn(err);
    }
    setSaving(false);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Page Title:</span>
      <Popover>
        <PopoverTrigger asChild>
          <span className="cursor-pointer underline decoration-dashed text-sm text-gray-600">
            {name || "Page title"}
          </span>
        </PopoverTrigger>
        <PopoverContent className="p-2" sideOffset={4} align="center">
          <div className="text-xs pb-1">Change page title:</div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => handleSave(name)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.target.blur();
              }
            }}
            placeholder="Page name"
            className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 w-full"
            disabled={saving}
          />
        </PopoverContent>
      </Popover>
      &nbsp;|&nbsp;
      <span className="text-sm text-gray-600">Page Path:</span>
      <span className="text-sm text-gray-500">{path}</span>
    </div>
  );
};
