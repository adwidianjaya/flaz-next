import { z } from "zod";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const spec = {
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

const AvatarComponent = ({
  src,
  alt = "",
  fallback = "",
  size = "md",
  shape = "circle",
  class: classProp,
  className,
  elementId,
}) => {
  const sizeClass = cn(
    size === "xs" && "size-6",
    size === "sm" && "size-8",
    size === "md" && "size-10",
    size === "lg" && "size-12",
    size === "xl" && "size-16",
  );
  const shapeClass = shape === "square" ? "rounded-md" : "rounded-full";

  return (
    <Avatar data-element-id={elementId} className={cn(sizeClass, shapeClass, classProp, className)}>
      {src ? <AvatarImage src={src} alt={alt || ""} className={shapeClass} /> : null}
      <AvatarFallback className={shapeClass}>{fallback || "?"}</AvatarFallback>
    </Avatar>
  );
};

export default AvatarComponent;
