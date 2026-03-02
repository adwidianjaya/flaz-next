import { z } from "zod";

export const spec = {
  description: "Semantic hyperlink for content blocks.",
  tags: ["Content", "Action"],
  props: z
    .object({
      text: z.string().optional(),
      href: z.string().optional(),
      target: z.enum(["_self", "_blank"]).optional().default("_self"),
      rel: z.string().optional(),
      class: z.string().optional(),
      className: z.string().optional(),
    })
    .toJSONSchema(),
};
