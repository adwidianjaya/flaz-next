import { z } from "zod";
import { cn } from "@/lib/utils";

export const spec = {
  description: "Skeleton placeholder block for loading layouts.",
  tags: ["Content", "Layout"],
  props: z
    .object({
      width: z.union([z.number().positive(), z.string()]).optional(),
      height: z.union([z.number().positive(), z.string()]).optional(),
      shape: z.enum(["rounded", "square", "circle"]).optional().default("rounded"),
      class: z.string().optional(),
      className: z.string().optional(),
    })
    .toJSONSchema(),
};

const SkeletonComponent = ({
  width = "100%",
  height = "1rem",
  shape = "rounded",
  class: classProp,
  className,
  elementId,
}) => {
  return (
    <div
      data-element-id={elementId}
      className={cn(
        "animate-pulse bg-muted",
        shape === "rounded" && "rounded-md",
        shape === "square" && "rounded-none",
        shape === "circle" && "rounded-full",
        classProp,
        className,
      )}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
    />
  );
};

export default SkeletonComponent;
