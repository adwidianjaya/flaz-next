import { z } from "zod";

export const spec = {
  description:
    "Text input with optional type for single line, or textarea when multiline is true.",
  tags: ["Input"],
  props: z
    .object({
      label: z.string().optional(),
      description: z.string().optional(),
      placeholder: z.string().optional(),
      disabled: z.boolean().optional(),
      value: z.union([z.string(), z.number()]).optional(),
      type: z
        .enum([
          "text",
          "email",
          "password",
          "number",
          "tel",
          "url",
          "search",
          "date",
          "time",
          "multiline",
        ])
        .optional()
        .default("text"),
      rows: z.number().int().min(2).optional().default(2),
      className: z.string().optional(),
    })
    .toJSONSchema(),
};
