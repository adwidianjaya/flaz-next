"use client";

import { z } from "zod";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

export const spec = {
  description: "Toggle group for single or multiple selected values.",
  tags: ["Input", "Form"],
  props: z
    .object({
      label: z.string().optional(),
      description: z.string().optional(),
      type: z.enum(["single", "multiple"]).optional().default("single"),
      value: z.string().optional(),
      values: z.array(z.string()).optional().default([]),
      disabled: z.boolean().optional(),
      variant: z.enum(["default", "outline"]).optional().default("default"),
      size: z.enum(["default", "sm", "lg"]).optional().default("default"),
      options: z
        .array(
          z.object({
            label: z.string(),
            value: z.string(),
          }),
        )
        .optional()
        .default([]),
      className: z.string().optional(),
    })
    .toJSONSchema(),
};

const ToggleGroupInput = ({
  label = "",
  description = "",
  type = "single",
  value,
  values = [],
  disabled = false,
  variant = "default",
  size = "default",
  options = [],
  className,
  elementId,
  onChangeValue,
  onChangeValues,
}) => {
  return (
    <FieldGroup data-element-id={elementId}>
      <Field>
        {label && <FieldLabel>{label}</FieldLabel>}
        <ToggleGroup
          type={type}
          variant={variant}
          size={size}
          disabled={disabled}
          className={className}
          value={type === "multiple" ? values : value}
          onValueChange={(next) => {
            if (type === "multiple") {
              onChangeValues?.(Array.isArray(next) ? next : []);
            } else {
              onChangeValue?.(typeof next === "string" ? next : "");
            }
          }}
        >
          {options.map((option) => (
            <ToggleGroupItem key={option.value} value={option.value}>
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        {description && <FieldDescription>{description}</FieldDescription>}
      </Field>
    </FieldGroup>
  );
};

export default ToggleGroupInput;
