"use client";

import { z } from "zod";
import { Switch } from "@/components/ui/switch";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

export const spec = {
  description: "Switch control for boolean on/off input.",
  tags: ["Input", "Form"],
  props: z
    .object({
      label: z.string().optional(),
      description: z.string().optional(),
      checked: z.boolean().optional(),
      disabled: z.boolean().optional(),
      size: z.enum(["default", "sm"]).optional().default("default"),
      className: z.string().optional(),
    })
    .toJSONSchema(),
};

const SwitchInput = ({
  label = "",
  description = "",
  checked,
  disabled = false,
  size = "default",
  className,
  elementId,
  onChangeChecked,
}) => {
  const id = label ? label.split(" ").join("-") : undefined;

  return (
    <FieldGroup data-element-id={elementId}>
      <Field orientation="horizontal">
        <Switch
          id={id}
          checked={checked}
          disabled={disabled}
          size={size}
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

export default SwitchInput;
