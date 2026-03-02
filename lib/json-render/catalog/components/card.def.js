import { z } from "zod";

export const def = {
  description:
    "Card component, used to group other components inside its children.",
  tags: ["Layout", "Content"],
  props: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      width: z.union([z.number().positive(), z.string()]).optional(),
      maxWidth: z.enum(["sm", "md", "lg", "xl", "2xl", "3xl"]).optional(),
      centered: z.boolean().optional(),
      layout: z.enum(["stack", "grid"]).optional().default("stack"),
      gap: z.enum(["0", "2", "4", "6", "8"]).optional().default("4"),
      columns: z.enum(["1", "2", "3", "4"]).optional().default("1"),
      className: z.string().optional(),
    })
    .toJSONSchema(),
};
