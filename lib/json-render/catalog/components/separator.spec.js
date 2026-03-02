import { z } from "zod";

export const spec = {
  description: "Visual separator line with horizontal or vertical orientation.",
  tags: ["Layout", "Content"],
  props: z
    .object({
      orientation: z.enum(["horizontal", "vertical"]).optional().default("horizontal"),
      decorative: z.boolean().optional(),
      class: z.string().optional(),
      className: z.string().optional(),
    })
    .toJSONSchema(),
};
