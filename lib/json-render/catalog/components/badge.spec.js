import { z } from "zod";

export const spec = {
  description: "Small badge label for status, category, or metadata.",
  tags: ["Content"],
  props: z
    .object({
      label: z.string().optional(),
      variant: z
        .enum(["default", "secondary", "destructive", "outline"])
        .optional()
        .default("default"),
      className: z.string().optional(),
    })
    .toJSONSchema(),
};
