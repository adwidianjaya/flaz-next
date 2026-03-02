import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

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
