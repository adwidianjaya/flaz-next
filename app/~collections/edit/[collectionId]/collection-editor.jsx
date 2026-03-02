"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Plus, Trash2, Columns3, Rows3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { saveCurrentCollection } from "../../action";
import {
  COLLECTION_FIELD_TYPES,
  createFieldDefinition,
  createRowDefinition,
  normalizeCollectionSchema,
} from "../../schema";

const getDefaultValue = (type) => {
  switch (type) {
    case "number":
      return 0;
    case "boolean":
      return false;
    case "json":
      return {};
    default:
      return "";
  }
};

const coerceValueForType = (value, type) => {
  if (value === "" || value === null || value === undefined) {
    return type === "number" ? "" : getDefaultValue(type);
  }

  switch (type) {
    case "number": {
      const nextValue = Number(value);
      return Number.isNaN(nextValue) ? 0 : nextValue;
    }
    case "boolean":
      return value === true || value === "true";
    case "json":
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      }
      return value;
    default:
      return String(value);
  }
};

const getCellDisplayValue = (value, type) => {
  if (type === "json") {
    return typeof value === "string" ? value : JSON.stringify(value, null, 2);
  }

  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
};

export const CollectionEditor = ({ collection }) => {
  const [schema, setSchema] = useState(() =>
    normalizeCollectionSchema(collection.schema),
  );
  const [selectedFieldId, setSelectedFieldId] = useState(
    collection.schema?.fields?.[0]?.id || null,
  );
  const [saveState, setSaveState] = useState("idle");
  const [isPending, startSaveTransition] = useTransition();
  const hasMountedRef = useRef(false);
  const saveTimeoutRef = useRef(null);

  const queueSchemaUpdate = (updater) => {
    setSaveState("saving");
    setSchema(updater);
  };

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      startSaveTransition(async () => {
        try {
          const result = await saveCurrentCollection({
            collectionId: collection.id,
            schema,
          });
          setSaveState(result?.success ? "saved" : "error");
        } catch (error) {
          console.warn("Failed to save collection schema", error);
          setSaveState("error");
        }
      });
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [collection.id, schema, startSaveTransition]);

  const selectedField =
    schema.fields.find((field) => field.id === selectedFieldId) || null;

  const updateField = (fieldId, updater) => {
    queueSchemaUpdate((currentSchema) => ({
      ...currentSchema,
      fields: currentSchema.fields.map((field) =>
        field.id === fieldId ? updater(field) : field,
      ),
    }));
  };

  const handleAddField = () => {
    const newField = createFieldDefinition(schema.fields.length);

    queueSchemaUpdate((currentSchema) => ({
      fields: [...currentSchema.fields, newField],
      rows: currentSchema.rows.map((row) => ({
        ...row,
        values: {
          ...row.values,
          [newField.id]: getDefaultValue(newField.type),
        },
      })),
    }));
    setSelectedFieldId(newField.id);
  };

  const handleDeleteField = (fieldId) => {
    const remainingFields = schema.fields.filter((field) => field.id !== fieldId);

    queueSchemaUpdate((currentSchema) => ({
      fields: currentSchema.fields.filter((field) => field.id !== fieldId),
      rows: currentSchema.rows.map((row) => {
        const nextValues = { ...row.values };
        delete nextValues[fieldId];
        return {
          ...row,
          values: nextValues,
        };
      }),
    }));
    setSelectedFieldId((currentSelectedFieldId) =>
      currentSelectedFieldId === fieldId
        ? remainingFields[0]?.id || null
        : currentSelectedFieldId,
    );
  };

  const handleFieldTypeChange = (fieldId, type) => {
    queueSchemaUpdate((currentSchema) => ({
      fields: currentSchema.fields.map((field) =>
        field.id === fieldId ? { ...field, type } : field,
      ),
      rows: currentSchema.rows.map((row) => ({
        ...row,
        values: {
          ...row.values,
          [fieldId]: coerceValueForType(row.values[fieldId], type),
        },
      })),
    }));
  };

  const handleAddRow = () => {
    queueSchemaUpdate((currentSchema) => ({
      ...currentSchema,
      rows: [...currentSchema.rows, createRowDefinition(currentSchema.fields)],
    }));
  };

  const handleDeleteRow = (rowId) => {
    queueSchemaUpdate((currentSchema) => ({
      ...currentSchema,
      rows: currentSchema.rows.filter((row) => row.id !== rowId),
    }));
  };

  const handleCellChange = (rowId, fieldId, value, type) => {
    queueSchemaUpdate((currentSchema) => ({
      ...currentSchema,
      rows: currentSchema.rows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              values: {
                ...row.values,
                [fieldId]: coerceValueForType(value, type),
              },
            }
          : row,
      ),
    }));
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <aside className="flex w-[320px] shrink-0 flex-col border-r border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-gray-900">Fields</div>
              <div className="text-xs text-gray-500">
                Manage the dynamic columns for this collection.
              </div>
            </div>
            <Button size="sm" onClick={handleAddField}>
              <Plus />
              Add
            </Button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
          {schema.fields.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
              Add a field to start building this collection table.
            </div>
          ) : (
            <div className="space-y-1">
              {schema.fields.map((field, index) => (
                <button
                  key={field.id}
                  onClick={() => setSelectedFieldId(field.id)}
                  className={cn(
                    "w-full rounded-lg border px-3 py-3 text-left transition",
                    selectedFieldId === field.id
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-transparent bg-gray-50 hover:border-gray-200 hover:bg-white",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-sm font-medium">
                      {field.label}
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide",
                        selectedFieldId === field.id
                          ? "bg-white/15 text-white"
                          : "bg-gray-200 text-gray-600",
                      )}
                    >
                      {field.type}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "mt-1 truncate text-xs",
                      selectedFieldId === field.id
                        ? "text-gray-300"
                        : "text-gray-500",
                    )}
                  >
                    {field.name || `field_${index + 1}`}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 bg-gray-50 p-4">
          {selectedField ? (
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                Selected Field
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Label</label>
                <Input
                  value={selectedField.label}
                  onChange={(event) =>
                    updateField(selectedField.id, (field) => ({
                      ...field,
                      label: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Name</label>
                <Input
                  value={selectedField.name}
                  onChange={(event) =>
                    updateField(selectedField.id, (field) => ({
                      ...field,
                      name: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Type</label>
                <Select
                  value={selectedField.type}
                  onValueChange={(value) =>
                    handleFieldTypeChange(selectedField.id, value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COLLECTION_FIELD_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={() => handleDeleteField(selectedField.id)}
              >
                <Trash2 />
                Delete Field
              </Button>
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              Select a field to edit its settings.
            </div>
          )}
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col bg-stone-50">
        <div className="border-b border-gray-200 bg-white px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-lg font-semibold text-gray-900">
                Collection Preview
              </div>
              <div className="text-sm text-gray-500">
                Edit rows directly in the table while adjusting columns from the
                sidebar.
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleAddField}>
                <Columns3 />
                Add Column
              </Button>
              <Button size="sm" onClick={handleAddRow}>
                <Rows3 />
                Add Row
              </Button>
              <div className="text-xs text-gray-500">
                {saveState === "saving" || isPending
                  ? "Saving..."
                  : saveState === "saved"
                    ? "Saved"
                    : saveState === "error"
                      ? "Save failed"
                      : "Idle"}
              </div>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto p-5">
          {schema.fields.length === 0 ? (
            <div className="flex h-full min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white text-center">
              <div>
                <div className="text-base font-medium text-gray-900">
                  No columns yet
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  Add a column from the sidebar to start shaping this table.
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      {schema.fields.map((field) => (
                        <th
                          key={field.id}
                          className="min-w-[180px] border-b border-r border-gray-200 px-4 py-3 text-left align-bottom"
                        >
                          <div className="text-sm font-semibold text-gray-900">
                            {field.label}
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            {field.name}
                          </div>
                        </th>
                      ))}
                      <th className="w-[100px] border-b border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {schema.rows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={schema.fields.length + 1}
                          className="px-4 py-12 text-center text-sm text-gray-500"
                        >
                          No rows yet. Add a row to preview collection data.
                        </td>
                      </tr>
                    ) : (
                      schema.rows.map((row, rowIndex) => (
                        <tr key={row.id} className="align-top">
                          {schema.fields.map((field) => (
                            <td
                              key={field.id}
                              className="border-r border-b border-gray-200 px-3 py-3"
                            >
                              {field.type === "boolean" ? (
                                <Select
                                  value={String(Boolean(row.values[field.id]))}
                                  onValueChange={(value) =>
                                    handleCellChange(
                                      row.id,
                                      field.id,
                                      value,
                                      field.type,
                                    )
                                  }
                                >
                                  <SelectTrigger className="w-full bg-white">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="true">True</SelectItem>
                                    <SelectItem value="false">False</SelectItem>
                                  </SelectContent>
                                </Select>
                              ) : field.type === "json" ? (
                                <Textarea
                                  size="sm"
                                  className="min-h-24 bg-white font-mono text-xs"
                                  value={getCellDisplayValue(
                                    row.values[field.id],
                                    field.type,
                                  )}
                                  onChange={(event) =>
                                    handleCellChange(
                                      row.id,
                                      field.id,
                                      event.target.value,
                                      field.type,
                                    )
                                  }
                                />
                              ) : (
                                <Input
                                  type={field.type === "number" ? "number" : "text"}
                                  value={getCellDisplayValue(
                                    row.values[field.id],
                                    field.type,
                                  )}
                                  onChange={(event) =>
                                    handleCellChange(
                                      row.id,
                                      field.id,
                                      event.target.value,
                                      field.type,
                                    )
                                  }
                                  placeholder={`${field.label} (${rowIndex + 1})`}
                                  className="bg-white"
                                />
                              )}
                            </td>
                          ))}
                          <td className="border-b border-gray-200 px-3 py-3">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleDeleteRow(row.id)}
                              aria-label={`Delete row ${rowIndex + 1}`}
                            >
                              <Trash2 />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
