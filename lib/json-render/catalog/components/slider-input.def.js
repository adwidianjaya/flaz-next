import { z } from "zod";

export const def = {
  description: "Slider control for numeric value input.",
  tags: ["Input", "Form"],
  props: z
    .object({
      label: z.string().optional(),
      description: z.string().optional(),
      value: z.union([z.number(), z.array(z.number())]).optional(),
      min: z.number().optional().default(0),
      max: z.number().optional().default(100),
      step: z.number().positive().optional(),
      disabled: z.boolean().optional(),
      className: z.string().optional(),
    })
    .toJSONSchema(),
};
