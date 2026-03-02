"use client";

import { Toggle } from "@/components/ui/toggle";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

const ToggleInput = ({
  label = "Toggle",
  description = "",
  pressed,
  disabled = false,
  variant = "default",
  size = "default",
  className,
  elementId,
  onChangePressed,
}) => {
  return (
    <FieldGroup data-element-id={elementId}>
      <Field>
        <Toggle
          pressed={pressed}
          disabled={disabled}
          variant={variant}
          size={size}
          className={className}
          onPressedChange={(value) => onChangePressed?.(!!value)}
        >
          {label}
        </Toggle>
        {description && <FieldDescription>{description}</FieldDescription>}
      </Field>
    </FieldGroup>
  );
};

export default ToggleInput;
