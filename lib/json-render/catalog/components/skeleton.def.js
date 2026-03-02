import { z } from "zod";

export const def = {
  description: "Skeleton placeholder block for loading layouts.",
  tags: ["Content", "Layout"],
  props: z
    .object({
      width: z.union([z.number().positive(), z.string()]).optional(),
      height: z.union([z.number().positive(), z.string()]).optional(),
      shape: z.enum(["rounded", "square", "circle"]).optional().default("rounded"),
      class: z.string().optional(),
      className: z.string().optional(),
    })
    .toJSONSchema(),
};
