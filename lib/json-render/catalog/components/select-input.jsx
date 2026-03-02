"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

const SelectInput = ({
  label = "",
  description = "",
  placeholder = "Select an option",
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
        <Select value={value} disabled={disabled} onValueChange={onChangeValue}>
          <SelectTrigger className={className}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {description && <FieldDescription>{description}</FieldDescription>}
      </Field>
    </FieldGroup>
  );
};

export default SelectInput;
