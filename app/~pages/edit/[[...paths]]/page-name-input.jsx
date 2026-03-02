"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { saveCurrentPageName } from "../../action";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const PageNameInput = ({ initialName, path }) => {
  const [name, setName] = useState(initialName || "");
  const [savedName, setSavedName] = useState(initialName || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async (newName) => {
    if (savedName === newName) return;

    setSaving(true);
    try {
      await saveCurrentPageName({
        name: newName,
        path,
      });
      setSavedName(newName);
    } catch (err) {
      console.warn(err);
    }
    setSaving(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
      <span>Page:</span>
      <Popover>
        <PopoverTrigger asChild>
          <button className="cursor-pointer underline decoration-dashed underline-offset-4">
            {name || "Untitled page"}
          </button>
        </PopoverTrigger>
        <PopoverContent className="p-3" sideOffset={4} align="start">
          <div className="mb-2 text-xs font-medium text-gray-500">
            Rename page
          </div>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => handleSave(name)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
            }}
            disabled={saving}
            placeholder="Page name"
          />
        </PopoverContent>
      </Popover>
      <span className="text-gray-300">|</span>
      <span>Path:</span>
      <Link
        href={path || "/"}
        target="_blank"
        rel="noreferrer"
        className="rounded bg-white px-2 py-1 text-xs text-gray-700 shadow-xs transition hover:text-gray-900 hover:shadow-sm"
      >
        <code>{path}</code>
      </Link>
      <Button asChild type="button" size="sm" variant="outline" className="h-7">
        <Link href={path || "/"} target="_blank" rel="noreferrer">
          <ExternalLink className="size-3.5" />
          Open Preview
        </Link>
      </Button>
    </div>
  );
};
