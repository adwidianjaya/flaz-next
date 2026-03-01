import { z } from "zod";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

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

const SeparatorComponent = ({
  orientation = "horizontal",
  decorative = true,
  class: classProp,
  className,
  elementId,
}) => {
  return (
    <Separator
      data-element-id={elementId}
      orientation={orientation}
      decorative={decorative}
      className={cn(
        orientation === "vertical" && "min-h-6",
        classProp,
        className,
      )}
    />
  );
};

export default SeparatorComponent;
