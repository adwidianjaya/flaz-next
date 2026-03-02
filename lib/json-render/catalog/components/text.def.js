import { z } from "zod";

export const def = {
  description: "Plain text, with level such as heading or paragraph.",
  tags: ["Content"],
  props: z
    .object({
      text: z.string().optional(),
      level: z
        .enum(["h1", "h2", "h3", "h4", "h5", "h6", "p"])
        .optional()
        .default("p"),
      className: z.string().optional(),
    })
    .toJSONSchema(),
};
