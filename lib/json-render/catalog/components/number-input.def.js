import { z } from "zod";

export const def = {
  description: "Number input with min/max/step support.",
  tags: ["Input"],
  props: z
    .object({
      label: z.string().optional(),
      description: z.string().optional(),
      placeholder: z.string().optional(),
      disabled: z.boolean().optional(),
      value: z.number().optional(),
      min: z.number().optional(),
      max: z.number().optional(),
      step: z.number().optional().default(1),
      class: z.string().optional(),
      className: z.string().optional(),
    })
    .toJSONSchema(),
};
