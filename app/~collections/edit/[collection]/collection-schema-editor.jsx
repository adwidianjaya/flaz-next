"use client";

import { useState, useCallback } from "react";
import { saveCurrentCollection } from "../../action";
import { Button } from "@/components/ui/button";

export const CollectionSchemaEditor = ({
  collectionId,
  initialSchema,
}) => {
  const [schema, setSchema] = useState(JSON.stringify(initialSchema, null, 2));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = useCallback(async () => {
    setError(null);
    setSaving(true);

    try {
      const parsed = JSON.parse(schema);
      const result = await saveCurrentCollection({
        collectionId,
        schema: parsed,
      });

      if (!result.success) {
        setError(result.error || "Failed to save schema");
      } else {
        // Optionally show success feedback
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError("Invalid JSON: " + err.message);
      } else {
        setError("Failed to save schema");
        console.error(err);
      }
    } finally {
      setSaving(false);
    }
  }, [schema, collectionId]);

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <div className="flex-1 flex flex-col gap-2">
        <label className="text-sm font-medium">Schema (JSON)</label>
        <textarea
          value={schema}
          onChange={(e) => setSchema(e.target.value)}
          className="flex-1 p-3 font-mono text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"
          placeholder="Define your collection schema as JSON..."
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Schema"}
        </Button>
      </div>
    </div>
  );
};
