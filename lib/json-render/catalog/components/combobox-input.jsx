"use client";

import { z } from "zod";
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "@/components/ui/combobox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

export const spec = {
  description: "Combobox input for filtering and selecting a value.",
  tags: ["Input", "Form"],
  props: z
    .object({
      label: z.string().optional(),
      description: z.string().optional(),
      placeholder: z.string().optional(),
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

const ComboboxInputComponent = ({
  label = "",
  description = "",
  placeholder = "Search...",
  value,
  disabled = false,
  options = [],
  className,
  onChangeValue,
}) => {
  return (
    <FieldGroup>
      <Field>
        {label && <FieldLabel>{label}</FieldLabel>}
        <Combobox value={value} onValueChange={onChangeValue} disabled={disabled}>
          <ComboboxInput className={className} placeholder={placeholder} />
          <ComboboxContent>
            <ComboboxEmpty>No results.</ComboboxEmpty>
            <ComboboxCollection>
              <ComboboxList>
                {options.map((option) => (
                  <ComboboxItem key={option.value} value={option.value}>
                    <ComboboxValue>{option.label}</ComboboxValue>
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxCollection>
          </ComboboxContent>
        </Combobox>
        {description && <FieldDescription>{description}</FieldDescription>}
      </Field>
    </FieldGroup>
  );
};

export default ComboboxInputComponent;
