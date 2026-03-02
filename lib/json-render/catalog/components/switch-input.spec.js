import { z } from "zod";

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
