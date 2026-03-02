import { z } from "zod";

export const def = {
  description: "Checkbox control for boolean input.",
  tags: ["Input", "Form"],
  props: z
    .object({
      label: z.string().optional(),
      description: z.string().optional(),
      checked: z.boolean().optional(),
      disabled: z.boolean().optional(),
      required: z.boolean().optional(),
      className: z.string().optional(),
    })
    .toJSONSchema(),
};
