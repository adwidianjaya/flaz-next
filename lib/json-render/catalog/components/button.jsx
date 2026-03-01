import { z } from "zod";
import { Button } from "@/components/ui/button";

export const spec = {
  description: "Clickable button. Bind onclick to handle click events.",
  tags: ["Action", "Form"],
  props: z
    .object({
      label: z.string().optional(),
      variant: z
        .enum([
          "default",
          "destructive",
          "outline",
          "secondary",
          "ghost",
          "link",
        ])
        .optional(),
      size: z.enum(["default", "xs", "sm", "lg"]).optional(),
      disabled: z.boolean().optional(),
      className: z.string().optional(),
    })
    .toJSONSchema(),
  events: ["onclick"],
};

const ButtonComponent = ({ label, variant, size, disabled, className, elementId }) => {
  return (
    <Button
      data-element-id={elementId}
      disabled={disabled}
      className={className}
      variant={variant}
      size={size}
    >
      {label}
    </Button>
  );
};
export default ButtonComponent;
