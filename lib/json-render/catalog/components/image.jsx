import { cn } from "@/lib/utils";

const ImageComponent = ({
  src = "",
  alt = "",
  caption = "",
  width,
  height,
  fit = "cover",
  rounded = false,
  className,
  elementId,
}) => {
  return (
    // <figure data-element-id={elementId} className={cn("space-y-2", className)}>
    <img
      data-element-id={elementId}
      src={src}
      alt={alt || ""}
      width={width}
      height={height}
      className={cn(
        "w-full",
        fit === "contain" && "object-contain",
        fit === "cover" && "object-cover",
        fit === "fill" && "object-fill",
        fit === "none" && "object-none",
        fit === "scale-down" && "object-scale-down",
        rounded && "rounded-lg",
        className,
      )}
    />
    // {caption ? (
    //   <figcaption className="text-sm opacity-70">{caption}</figcaption>
    // ) : null}
    // </figure>
  );
};

export default ImageComponent;
