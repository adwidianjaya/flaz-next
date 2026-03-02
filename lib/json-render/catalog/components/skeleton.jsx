import { cn } from "@/lib/utils";

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
