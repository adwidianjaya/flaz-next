"use client";

import { z } from "zod";
import { Toggle } from "@/components/ui/toggle";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

export const spec = {
  description: "Toggle button for boolean pressed state.",
  tags: ["Input", "Form"],
  props: z
    .object({
      label: z.string().optional(),
      description: z.string().optional(),
      pressed: z.boolean().optional(),
      disabled: z.boolean().optional(),
      variant: z.enum(["default", "outline"]).optional().default("default"),
      size: z.enum(["default", "sm", "lg"]).optional().default("default"),
      className: z.string().optional(),
    })
    .toJSONSchema(),
};

const ToggleInput = ({
  label = "Toggle",
  description = "",
  pressed,
  disabled = false,
  variant = "default",
  size = "default",
  className,
  onChangePressed,
}) => {
  return (
    <FieldGroup>
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
