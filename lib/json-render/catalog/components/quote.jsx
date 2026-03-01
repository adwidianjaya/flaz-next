import { z } from "zod";
import { cn } from "@/lib/utils";

export const spec = {
  description: "Quoted text block with optional author and source.",
  tags: ["Content"],
  props: z
    .object({
      text: z.string().optional(),
      author: z.string().optional(),
      source: z.string().optional(),
      align: z.enum(["left", "center", "right"]).optional().default("left"),
      class: z.string().optional(),
      className: z.string().optional(),
    })
    .toJSONSchema(),
};

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
