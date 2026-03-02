import { z } from "zod";

export const spec = {
  description: "Container for flex or grid layouts.",
  tags: ["Layout"],
  props: z
    .object({
      layout: z.enum(["flex", "grid"]).optional().default("flex"),
      direction: z
        .enum(["row", "row-reverse", "column", "col-reverse"])
        .optional()
        .default("row"),
      columns: z.enum(["1", "2", "3", "4", "5", "6"]).optional().default("1"),
      gap: z.enum(["0", "2", "4", "6", "8"]).optional().default("0"),
      align: z
        .enum(["start", "center", "end", "stretch"])
        .optional()
        .default("stretch"),
      justify: z
        .enum([
          "start",
          "center",
          "end",
          "between",
          "around",
          "evenly",
          "stretch",
          "normal",
        ])
        .optional()
        .default("stretch"),
      class: z.string().optional(),
      className: z.string().optional(),
    })
    .toJSONSchema(),
};
