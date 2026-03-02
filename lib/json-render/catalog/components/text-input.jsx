"use client";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMemo } from "react";

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
