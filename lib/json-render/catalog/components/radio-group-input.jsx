"use client";

import { z } from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

export const spec = {
  description: "Radio group for single option selection.",
  tags: ["Input", "Form"],
  props: z
    .object({
      label: z.string().optional(),
      description: z.string().optional(),
      value: z.string().optional(),
      disabled: z.boolean().optional(),
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

const RadioGroupInput = ({
  label = "",
  description = "",
  value,
  disabled = false,
  options = [],
  className,
  onChangeValue,
}) => {
  const groupName = label ? label.split(" ").join("-") : "radio-group";

  return (
    <FieldGroup>
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
