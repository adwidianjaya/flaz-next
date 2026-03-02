import { z } from "zod";

export const spec = {
  description: "Image content with optional caption and size settings.",
  tags: ["Content"],
  props: z
    .object({
      src: z.string().optional(),
      alt: z.string().optional(),
      caption: z.string().optional(),
      width: z.number().int().positive().optional(),
      height: z.number().int().positive().optional(),
      fit: z
        .enum(["contain", "cover", "fill", "none", "scale-down"])
        .optional()
        .default("cover"),
      rounded: z.boolean().optional(),
      class: z.string().optional(),
      className: z.string().optional(),
    })
    .toJSONSchema(),
};
