import { cn } from "@/lib/utils";

const ContainerComponent = ({
  layout = "flex",
  direction = "row",
  columns = "1",
  gap = "0",
  align = "stretch",
  justify = "stretch",
  bgImageSrc,
  class: classProp,
  className,
  elementId,
  children,
}) => {
  return (
    <div
      data-element-id={elementId}
      style={{
        backgroundImage: bgImageSrc
          ? `url(${bgImageSrc})`
          : undefined,
        backgroundSize: bgImageSrc ? "cover" : undefined,
        backgroundPosition: bgImageSrc ? "center" : undefined,
        backgroundRepeat: bgImageSrc ? "no-repeat" : undefined,
      }}
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
