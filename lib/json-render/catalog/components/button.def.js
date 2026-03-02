import { z } from "zod";

export const def = {
  description: "Clickable button. Bind onclick to handle click events.",
  tags: ["Action", "Form"],
  props: z
    .object({
      label: z.string().optional(),
      variant: z
        .enum([
          "default",
          "destructive",
          "outline",
          "secondary",
          "ghost",
          "link",
        ])
        .optional(),
      size: z.enum(["default", "xs", "sm", "lg"]).optional(),
      disabled: z.boolean().optional(),
      className: z.string().optional(),
    })
    .toJSONSchema(),
  events: ["onclick"],
};
