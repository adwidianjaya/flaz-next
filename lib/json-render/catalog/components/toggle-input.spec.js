import { z } from "zod";

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
