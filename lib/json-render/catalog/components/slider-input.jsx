"use client";

import { Slider } from "@/components/ui/slider";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

const SliderInput = ({
  label = "",
  description = "",
  value,
  min = 0,
  max = 100,
  step,
  disabled = false,
  className,
  elementId,
  onChangeValue,
}) => {
  const sliderValue = Array.isArray(value)
    ? value
    : typeof value === "number"
      ? [value]
      : [min];

  return (
    <FieldGroup data-element-id={elementId}>
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
