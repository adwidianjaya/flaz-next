"use client";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

const NumberInputComponent = ({
  label = "",
  description = "",
  placeholder = "",
  disabled = false,
  value,
  min,
  max,
  step = 1,
  class: classProp,
  className,
  elementId,
  onChangeValue,
}) => {
  const inputId = useMemo(() => `number-${label.split(" ").join("-")}`, [label]);

  return (
    <FieldGroup data-element-id={elementId}>
      <Field>
        {label ? <FieldLabel htmlFor={inputId}>{label}</FieldLabel> : null}
        <Input
          id={inputId}
          type="number"
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          value={value ?? ""}
          placeholder={placeholder || label || ""}
          className={cn(classProp, className)}
          onChange={(event) => {
            const raw = event?.target?.value;
            if (raw === "") {
              onChangeValue?.(undefined);
              return;
            }
            const next = Number(raw);
            onChangeValue?.(Number.isNaN(next) ? undefined : next);
          }}
        />
        {description ? <FieldDescription>{description}</FieldDescription> : null}
      </Field>
    </FieldGroup>
  );
};

export default NumberInputComponent;
