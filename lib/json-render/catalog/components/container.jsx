import { z } from "zod";
import { cn } from "@/lib/utils";

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

const ContainerComponent = ({
  layout = "flex",
  direction = "row",
  columns = "1",
  gap = "0",
  align = "stretch",
  justify = "stretch",
  class: classProp,
  className,
  elementId,
  children,
}) => {
  return (
    <div
      data-element-id={elementId}
      className={cn(
        layout === "flex" && "flex",
        layout === "grid" && "grid",
        layout === "flex" && direction === "row" && "flex-row",
        layout === "flex" && direction === "row-reverse" && "flex-row-reverse",
        layout === "flex" && direction === "column" && "flex-col",
        layout === "flex" && direction === "col-reverse" && "flex-col-reverse",
        layout === "grid" && columns === "1" && "grid-cols-1",
        layout === "grid" && columns === "2" && "grid-cols-2",
        layout === "grid" && columns === "3" && "grid-cols-3",
        layout === "grid" && columns === "4" && "grid-cols-4",
        layout === "grid" && columns === "5" && "grid-cols-5",
        layout === "grid" && columns === "6" && "grid-cols-6",
        gap === "0" && "gap-0",
        gap === "2" && "gap-2",
        gap === "4" && "gap-4",
        gap === "6" && "gap-6",
        gap === "8" && "gap-8",
        align === "start" && "items-start",
        align === "center" && "items-center",
        align === "end" && "items-end",
        align === "stretch" && "items-stretch",
        justify === "start" && "justify-start",
        justify === "center" && "justify-center",
        justify === "end" && "justify-end",
        justify === "between" && "justify-between",
        justify === "around" && "justify-around",
        justify === "evenly" && "justify-evenly",
        justify === "stretch" && "justify-stretch",
        justify === "normal" && "justify-normal",
        classProp,
        className,
      )}
    >
      {children}
    </div>
  );
};

export default ContainerComponent;
