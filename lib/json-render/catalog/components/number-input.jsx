"use client";

import { z } from "zod";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useMemo } from "react";

export const spec = {
  description: "Number input with min/max/step support.",
  tags: ["Input"],
  props: z
    .object({
      label: z.string().optional(),
      description: z.string().optional(),
      placeholder: z.string().optional(),
      disabled: z.boolean().optional(),
      value: z.number().optional(),
      min: z.number().optional(),
      max: z.number().optional(),
      step: z.number().optional().default(1),
      class: z.string().optional(),
      className: z.string().optional(),
    })
    .toJSONSchema(),
};

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
  onChangeValue,
}) => {
  const inputId = useMemo(() => `number-${label.split(" ").join("-")}`, [label]);

  return (
    <FieldGroup>
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
          className={[classProp, className].filter(Boolean).join(" ")}
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
