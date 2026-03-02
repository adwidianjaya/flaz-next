"use client";

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

const ComboboxInputComponent = ({
  label = "",
  description = "",
  placeholder = "Search...",
  value,
  disabled = false,
  options = [],
  className,
  elementId,
  onChangeValue,
}) => {
  return (
    <FieldGroup data-element-id={elementId}>
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
