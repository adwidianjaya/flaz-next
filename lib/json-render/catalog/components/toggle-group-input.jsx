"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

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
