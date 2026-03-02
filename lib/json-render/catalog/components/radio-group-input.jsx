"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

const RadioGroupInput = ({
  label = "",
  description = "",
  value,
  disabled = false,
  options = [],
  className,
  elementId,
  onChangeValue,
}) => {
  const groupName = label ? label.split(" ").join("-") : "radio-group";

  return (
    <FieldGroup data-element-id={elementId}>
      <Field>
        {label && <FieldLabel>{label}</FieldLabel>}
        <RadioGroup
          value={value}
          onValueChange={onChangeValue}
          disabled={disabled}
          className={className}
        >
          {options.map((option) => {
            const id = `${groupName}-${option.value}`;
            return (
              <Field key={option.value} orientation="horizontal">
                <RadioGroupItem id={id} value={option.value} />
                <FieldLabel htmlFor={id}>{option.label}</FieldLabel>
              </Field>
            );
          })}
        </RadioGroup>
        {description && <FieldDescription>{description}</FieldDescription>}
      </Field>
    </FieldGroup>
  );
};

export default RadioGroupInput;
