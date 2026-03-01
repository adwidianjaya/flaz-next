"use client";

import { z } from "zod";
import { Slider } from "@/components/ui/slider";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

export const spec = {
  description: "Slider control for numeric value input.",
  tags: ["Input", "Form"],
  props: z
    .object({
      label: z.string().optional(),
      description: z.string().optional(),
      value: z.union([z.number(), z.array(z.number())]).optional(),
      min: z.number().optional().default(0),
      max: z.number().optional().default(100),
      step: z.number().positive().optional(),
      disabled: z.boolean().optional(),
      className: z.string().optional(),
    })
    .toJSONSchema(),
};

const SliderInput = ({
  label = "",
  description = "",
  value,
  min = 0,
  max = 100,
  step,
  disabled = false,
  className,
  onChangeValue,
}) => {
  const sliderValue = Array.isArray(value)
    ? value
    : typeof value === "number"
      ? [value]
      : [min];

  return (
    <FieldGroup>
      <Field>
        {label && <FieldLabel>{label}</FieldLabel>}
        <Slider
          value={sliderValue}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={className}
          onValueChange={(next) => {
            if (Array.isArray(value)) {
              onChangeValue?.(next);
            } else {
              onChangeValue?.(next?.[0]);
            }
          }}
        />
        {description && <FieldDescription>{description}</FieldDescription>}
      </Field>
    </FieldGroup>
  );
};

export default SliderInput;
