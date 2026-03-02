import { z } from "zod";

export const def = {
  description: "Quoted text block with optional author and source.",
  tags: ["Content"],
  props: z
    .object({
      text: z.string().optional(),
      author: z.string().optional(),
      source: z.string().optional(),
      align: z.enum(["left", "center", "right"]).optional().default("left"),
      class: z.string().optional(),
      className: z.string().optional(),
    })
    .toJSONSchema(),
};
