import { cn } from "@/lib/utils";

const QuoteComponent = ({
  text = "",
  author = "",
  source = "",
  align = "left",
  class: classProp,
  className,
  elementId,
}) => {
  return (
    <blockquote
      data-element-id={elementId}
      className={cn(
        "border-l-4 pl-4 py-1",
        align === "left" && "text-left",
        align === "center" && "text-center",
        align === "right" && "text-right",
        classProp,
        className,
      )}
    >
      <p className="italic">{text}</p>
      {(author || source) && (
        <footer className="mt-2 text-sm opacity-70">
          {author ? <span>{author}</span> : null}
          {author && source ? <span>, </span> : null}
          {source ? <cite>{source}</cite> : null}
        </footer>
      )}
    </blockquote>
  );
};

export default QuoteComponent;
