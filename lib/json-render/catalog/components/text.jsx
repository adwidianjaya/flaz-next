import { cn } from "@/lib/utils";

const TextComponent = ({ text = "", level = "p", className, elementId }) => {
  return (
    <div
      data-element-id={elementId}
      className={cn(
        "mt-2",
        level === "h1" && "text-3xl",
        level === "h2" && "text-2xl",
        level === "h3" && "text-xl",
        level === "h4" && "text-lg",
        level === "h5" && "text-base",
        level === "h6" && "text-sm",
        level === "p" && "text-sm",
        className,
      )}
    >
      {text}
    </div>
  );
};
export default TextComponent;
