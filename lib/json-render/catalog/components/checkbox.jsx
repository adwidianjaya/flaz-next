"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

const CheckboxInput = ({
  label = "",
  description = "",
  checked,
  disabled = false,
  required = false,
  className,
  elementId,
  onChangeChecked,
}) => {
  const id = label ? label.split(" ").join("-") : undefined;

  return (
    <FieldGroup data-element-id={elementId}>
      <Field orientation="horizontal">
        <Checkbox
          id={id}
          checked={checked}
          disabled={disabled}
          required={required}
          className={className}
          onCheckedChange={(value) => onChangeChecked?.(!!value)}
        />
        <div className="grid gap-1.5 leading-none">
          {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
          {description && <FieldDescription>{description}</FieldDescription>}
        </div>
      </Field>
    </FieldGroup>
  );
};

export default CheckboxInput;
