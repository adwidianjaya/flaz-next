import { z } from "zod";
import { cn } from "@/lib/utils";

const ContainerComponent = ({
  direction = "row",
  gap,
  align,
  justify,
  children,
  className,
}) => {
  return (
    <div
      class={cn(
        "flex",
        direction === "row" && "flex-row",
        direction === "column" && "flex-col",
        gap === "0" && `gap-0`,
        gap === "2" && `gap-2`,
        gap === "4" && `gap-4`,
        gap === "6" && `gap-6`,
        align === "start" && `items-start`,
        align === "center" && `items-center`,
        align === "end" && `items-end`,
        align === "stretch" && `items-stretch`,
        justify === "start" && `justify-start`,
        justify === "center" && `justify-center`,
        justify === "end" && `justify-end`,
        justify === "between" && `justify-between`,
        justify === "around" && `justify-around`,
        justify === "eventy" && `justify-evenly`,
        justify === "stretch" && `justify-stretch`,
        justify === "normal" && `justify-normal`,
        className,
      )}
    >
      {children}
    </div>
  );
};

const spec = {
  description: "Flex container for layouts.",
  props: z
    .object({
      direction: z.enum(["row", "column"]),
      gap: z.enum(["0", "2", "4", "6"]).optional(),
      align: z.enum(["start", "center", "end", "stretch"]).optional(),
      justify: z
        .enum([
          "start",
          "center",
          "end",
          "between",
          "around",
          "eventy",
          "stretch",
          "normal",
        ])
        .optional(),
      className: z.string().optional(),
    })
    .toJSONSchema(),
};

export { ContainerComponent as default, spec };
