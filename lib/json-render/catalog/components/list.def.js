import { z } from "zod";

const itemSchema = z.union([
  z.string(),
  z.object({
    label: z.string(),
    checked: z.boolean().optional(),
  }),
]);

export const def = {
  description: "List content for bullet, numbered, or checklist styles.",
  tags: ["Content"],
  props: z
    .object({
      items: z.array(itemSchema).optional().default([]),
      type: z.enum(["ul", "ol", "check"]).optional().default("ul"),
      marker: z.enum(["disc", "decimal", "none"]).optional().default("disc"),
      class: z.string().optional(),
      className: z.string().optional(),
    })
    .toJSONSchema(),
};
