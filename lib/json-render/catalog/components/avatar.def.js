import { z } from "zod";

export const def = {
  description: "Avatar image with fallback initials or text.",
  tags: ["Content"],
  props: z
    .object({
      src: z.string().optional(),
      alt: z.string().optional(),
      fallback: z.string().optional(),
      size: z.enum(["xs", "sm", "md", "lg", "xl"]).optional().default("md"),
      shape: z.enum(["circle", "square"]).optional().default("circle"),
      class: z.string().optional(),
      className: z.string().optional(),
    })
    .toJSONSchema(),
};
