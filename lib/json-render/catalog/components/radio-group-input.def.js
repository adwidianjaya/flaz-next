import { z } from "zod";

export const def = {
  description: "Radio group for single option selection.",
  tags: ["Input", "Form"],
  props: z
    .object({
      label: z.string().optional(),
      description: z.string().optional(),
      value: z.string().optional(),
      disabled: z.boolean().optional(),
      options: z
        .array(
          z.object({
            label: z.string(),
            value: z.string(),
          }),
        )
        .optional()
        .default([]),
      className: z.string().optional(),
    })
    .toJSONSchema(),
};
