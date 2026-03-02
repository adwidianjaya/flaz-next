import { z } from "zod";

export const def = {
  description: "Toggle group for single or multiple selected values.",
  tags: ["Input", "Form"],
  props: z
    .object({
      label: z.string().optional(),
      description: z.string().optional(),
      type: z.enum(["single", "multiple"]).optional().default("single"),
      value: z.string().optional(),
      values: z.array(z.string()).optional().default([]),
      disabled: z.boolean().optional(),
      variant: z.enum(["default", "outline"]).optional().default("default"),
      size: z.enum(["default", "sm", "lg"]).optional().default("default"),
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
