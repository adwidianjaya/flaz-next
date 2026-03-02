"use client";

import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
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
import { saveCurrentPage } from "./action";
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
    <div className="h-full flex flex-col bg-gray-100 overflow-hidden">
      <div className="flex sticky top-0 left-0 z-10 bg-gray-600 shrink-0">
        <button
          onClick={() => handleTabChange("props")}
          className={cn(
            "px-3 py-1 text-xs font-medium transition duration-100 cursor-pointer",
            activeTab === "props"
              ? "bg-gray-100 text-gray-900"
              : "text-white hover:bg-gray-500",
          )}
        >
          Props Editor
        </button>
        <button
          onClick={() => handleTabChange("schema")}
          className={cn(
            "px-3 py-1 text-xs font-medium transition duration-100 cursor-pointer",
            activeTab === "schema"
              ? "bg-gray-100 text-gray-900"
              : "text-white hover:bg-gray-500",
          )}
        >
          Schema
        </button>
      </div>

      {activeTab === "schema" && (
        <div className="relative group min-h-0 flex-1 overflow-auto bg-white border-t border-gray-200">
          <button
            onClick={handleCopy}
            className="absolute right-4 top-4 p-2 rounded-md bg-white border border-gray-200 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50 z-10"
            title="Copy schema"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </button>
          <LazySchemaViewer code={deferredSchemaStringified} />
        </div>
      )}

      {activeTab === "props" && (
        <div className="px-3 py-2 flex-1 overflow-auto">
          {selectedElement ? (
            <div>
              <div className="text-xs font-semibold mb-2 py-1 border-b border-gray-200">
                Selected Element: {selectedElement.type} [
                {selectedElement.elementId}]
              </div>
              <div className="space-y-2">
                {Object.entries(selectedElement.props || {}).map(
                  ([key, value]) => {
                    const propSpec = getPropSpec(selectedElement.type, key);
                    const isEnum = propSpec?.enum !== undefined;
                    const enumValues = propSpec?.enum || [];

                    return (
                      <div key={key} className="text-xs">
                        <div className="font-medium text-gray-600 mb-1">
                          {key}
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
                              className="font-mono text-xs h-auto w-full bg-white"
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
                            className="font-mono text-xs min-h-[unset] bg-white"
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
            <div className="text-xs text-gray-600">
              Click on a component in the preview to edit its props
            </div>
          )}
        </div>
      )}
    </div>
  );
};
