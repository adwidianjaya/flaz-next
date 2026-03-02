"use client";

import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  store,
  useSchema,
  useSelectedElement,
  useActiveTab,
} from "@/lib/json-render/ui/store";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useDeferredValue,
} from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { snapshot } from "valtio";
import * as componentDefs from "@/lib/json-render/catalog/components/defs";
import { saveCurrentPage } from "../../action";
import { Copy, Check } from "lucide-react";

const getPropSpec = (componentType, propName) => {
  const spec = componentDefs[componentType];
  if (!spec?.props?.properties?.[propName]) return null;
  return spec.props.properties[propName];
};

const LazySchemaViewer = dynamic(
  () => import("./schema-viewer").then((mod) => mod.SchemaViewer),
  {
    ssr: false,
    loading: () => (
      <pre className="m-0 p-2 text-xs font-mono text-gray-500">
        Loading schema...
      </pre>
    ),
  },
);

export const SideNavigator = () => {
  const params = useParams();
  const saveTimeoutRef = useRef(null);
  const [schema] = useSchema();
  const [selectedElement, selectedElementActions] = useSelectedElement();
  const [activeTab, activeTabActions] = useActiveTab();
  const [copied, setCopied] = useState(false);
  const currentPath = useMemo(
    () => ["", ...(params.paths || [])].join("/"),
    [params.paths],
  );

  const schemaStringified = useMemo(() => {
    if (activeTab !== "schema") return "";
    return JSON.stringify(schema, null, 2);
  }, [schema, activeTab]);

  const deferredSchemaStringified = useDeferredValue(schemaStringified);

  const handleCopy = () => {
    navigator.clipboard.writeText(schemaStringified);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveCurrentPageDebounced = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const currentStore = snapshot(store);
        // console.log(
        //   "...currentStore.schema",
        //   currentStore.schema,
        //   currentStore.definition.elements["form-title"].props,
        // );
        await saveCurrentPage({
          name: "",
          path: currentPath,
          schema: currentStore.schema,
          definition: currentStore.definition,
        });
      } catch (error) {
        console.warn("Failed to save current page", error);
      }
    }, 700);
  }, [currentPath]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleTabChange = (tab) => {
    activeTabActions.setActiveTab(tab);
    if (tab === "props") {
      selectedElementActions.setSelectedElement(null);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
      <div className="border-b border-gray-200 px-4 py-3">
        <div className="mb-3">
          <div className="text-sm font-semibold text-gray-900">Inspector</div>
          <div className="text-xs text-gray-500">
            Switch between live props editing and the generated schema.
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleTabChange("props")}
            className={cn(
              "rounded-lg px-3 py-2 text-xs font-medium transition",
              activeTab === "props"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900",
            )}
          >
            Props Editor
          </button>
          <button
            onClick={() => handleTabChange("schema")}
            className={cn(
              "rounded-lg px-3 py-2 text-xs font-medium transition",
              activeTab === "schema"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900",
            )}
          >
            Schema
          </button>
        </div>
      </div>

      {activeTab === "schema" && (
        <div className="min-h-0 flex-1 overflow-auto bg-stone-50 p-4">
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="absolute right-3 top-3 z-10 size-8 opacity-0 transition-opacity group-hover:opacity-100"
              title="Copy schema"
            >
              {copied ? (
                <Check className="size-4 text-green-600" />
              ) : (
                <Copy className="size-4 text-gray-400" />
              )}
            </Button>
            <LazySchemaViewer code={deferredSchemaStringified} />
          </div>
        </div>
      )}

      {activeTab === "props" && (
        <div className="min-h-0 flex-1 overflow-auto bg-stone-50 p-4">
          {selectedElement ? (
            <div className="sticky top-4 space-y-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="border-b border-gray-200 pb-3">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  Selected Element
                </div>
                <div className="mt-2 text-sm font-medium text-gray-900">
                  {selectedElement.type}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {selectedElement.elementId}
                </div>
              </div>
              <div className="space-y-2">
                {Object.entries(selectedElement.props || {}).map(
                  ([key, value]) => {
                    const propSpec = getPropSpec(selectedElement.type, key);
                    const isEnum = propSpec?.enum !== undefined;
                    const enumValues = propSpec?.enum || [];

                    return (
                      <div key={key} className="space-y-1 text-xs">
                        <div className="font-medium text-gray-600">{key}</div>
                        <div className="text-[11px] text-gray-400">
                          {isEnum ? "Enum value" : "Property value"}
                        </div>
                        {isEnum ? (
                          <Select
                            value={String(value ?? "")}
                            onValueChange={(newValue) => {
                              let parsedValue = newValue;
                              try {
                                parsedValue = JSON.parse(newValue);
                              } catch {
                                parsedValue = newValue;
                              }
                              // console.log({ key, parsedValue });
                              selectedElementActions.updateSelectedElementProp(
                                key,
                                String(parsedValue),
                              );
                              saveCurrentPageDebounced();
                            }}
                          >
                            <SelectTrigger
                              size="sm"
                              className="h-auto w-full bg-white font-mono text-xs"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {enumValues.map((enumValue) => (
                                <SelectItem
                                  key={enumValue}
                                  value={String(enumValue)}
                                  className="font-mono text-xs"
                                >
                                  {enumValue}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Textarea
                            size="sm"
                            className="min-h-[unset] bg-white font-mono text-xs"
                            value={
                              typeof value === "string"
                                ? value
                                : JSON.stringify(value, null, 2)
                            }
                            onChange={(e) => {
                              let parsedValue = e.target.value;
                              try {
                                parsedValue = JSON.parse(e.target.value);
                              } catch {
                                parsedValue = e.target.value;
                              }
                              selectedElementActions.updateSelectedElementProp(
                                key,
                                parsedValue,
                              );
                              saveCurrentPageDebounced();
                            }}
                            rows={1}
                          />
                        )}
                      </div>
                    );
                  },
                )}
                {Object.keys(selectedElement.props || {}).length === 0 && (
                  <div className="text-xs text-gray-500">
                    No props available
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-500">
              Click a component in the preview to edit its props here.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
