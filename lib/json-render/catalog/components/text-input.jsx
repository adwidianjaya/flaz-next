"use client";

import { z } from "zod";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMemo } from "react";

export const spec = {
  description:
    "Text input with optional type for single line, or textarea when multiline is true.",
  tags: ["Input"],
  props: z
    .object({
      label: z.string().optional(),
      description: z.string().optional(),
      placeholder: z.string().optional(),
      disabled: z.boolean().optional(),
      value: z.union([z.string(), z.number()]).optional(),
      type: z
        .enum([
          "text",
          "email",
          "password",
          "number",
          "tel",
          "url",
          "search",
          "date",
          "time",
          "multiline",
        ])
        .optional()
        .default("text"),
      rows: z.number().int().min(2).optional().default(2),
      className: z.string().optional(),
    })
    .toJSONSchema(),
};

const TextInput = ({
  label = "",
  description = "",
  placeholder = "",
  disabled = false,
  value,
  onChangeValue,
  type = "text",
  rows = 2,
  className,
  elementId,
}) => {
  const fieldGroupName = useMemo(() => label.split(" ").join("-"), [label]);
  // console.log({ fieldGroupName });

  return (
    <FieldGroup data-element-id={elementId}>
      <Field>
        <FieldLabel htmlFor={fieldGroupName}>{label}</FieldLabel>
        {type === "multiline" ? (
          <Textarea
            id={fieldGroupName}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            value={value}
            onChange={(e) => onChangeValue?.(e?.target?.value)}
            className={className}
          />
        ) : (
          <Input
            id={fieldGroupName}
            placeholder={placeholder}
            disabled={disabled}
            type={type}
            value={value}
            onChange={(e) => onChangeValue?.(e?.target?.value)}
            className={className}
          />
        )}
        {description && <FieldDescription>{description}</FieldDescription>}
      </Field>
    </FieldGroup>
  );
};
export default TextInput;
