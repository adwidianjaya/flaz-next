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
  useSchema,
  useSelectedElement,
  useActiveTab,
} from "@/lib/json-render/ui/store";
import { useMemo } from "react";
import * as componentSpecs from "@/lib/json-render/catalog/components/specs";

const getPropSpec = (componentType, propName) => {
  const spec = componentSpecs[componentType];
  if (!spec?.props?.properties?.[propName]) return null;
  return spec.props.properties[propName];
};

export const SideNavigator = () => {
  const [schema] = useSchema();
  const [selectedElement, selectedElementActions] = useSelectedElement();
  const [activeTab, activeTabActions] = useActiveTab();

  const schemaStringified = useMemo(() => {
    return JSON.stringify(schema, null, 2);
  }, [schema]);

  const handleTabChange = (tab) => {
    activeTabActions.setActiveTab(tab);
    if (tab === "props") {
      selectedElementActions.setSelectedElement(null);
    }
  };

  return (
    <div className="h-full overflow-y-scroll bg-gray-100">
      <div className="flex sticky top-0 left-0 z-10 bg-gray-600">
        <button
          onClick={() => handleTabChange("schema")}
          className={cn(
            "px-3 py-1 text-xs font-medium transition duration-100",
            activeTab === "schema"
              ? "bg-gray-100 text-gray-900"
              : "text-white hover:bg-gray-500",
          )}
        >
          Schema
        </button>
        <button
          onClick={() => handleTabChange("props")}
          className={cn(
            "px-3 py-1 text-xs font-medium transition duration-100",
            activeTab === "props"
              ? "bg-gray-100 text-gray-900"
              : "text-white hover:bg-gray-500",
          )}
        >
          Props Editor
        </button>
      </div>
      {activeTab === "schema" && (
        <div
          className={cn(
            "whitespace-pre font-mono text-xs px-2 py-1",
            "text-gray-600 hover:text-black transition duration-100",
          )}
        >
          {schemaStringified}
        </div>
      )}

      {activeTab === "props" && (
        <div className="px-3 py-2">
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
                              selectedElementActions.updateSelectedElementProp(
                                key,
                                parsedValue,
                              );
                            }}
                          >
                            <SelectTrigger className="font-mono text-xs h-auto w-full">
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
                            className="font-mono text-xs min-h-[unset]"
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
