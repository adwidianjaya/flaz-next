import { z } from "zod";

export const spec = {
  description: "Linear progress bar for completion state.",
  tags: ["Content"],
  props: z
    .object({
      value: z.number().min(0).optional().default(0),
      max: z.number().positive().optional().default(100),
      tone: z
        .enum([
          "neutral",
          "primary",
          "secondary",
          "accent",
          "info",
          "success",
          "warning",
          "error",
        ])
        .optional()
        .default("neutral"),
      class: z.string().optional(),
      className: z.string().optional(),
    })
    .toJSONSchema(),
};
