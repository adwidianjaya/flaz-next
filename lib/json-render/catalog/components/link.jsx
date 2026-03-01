import { z } from "zod";
import { cn } from "@/lib/utils";

export const spec = {
  description: "Semantic hyperlink for content blocks.",
  tags: ["Content", "Action"],
  props: z
    .object({
      text: z.string().optional(),
      href: z.string().optional(),
      target: z.enum(["_self", "_blank"]).optional().default("_self"),
      rel: z.string().optional(),
      class: z.string().optional(),
      className: z.string().optional(),
    })
    .toJSONSchema(),
};

const LinkComponent = ({
  text = "",
  href = "",
  target = "_self",
  rel = "",
  class: classProp,
  className,
  elementId,
}) => {
  const safeRel = rel || (target === "_blank" ? "noopener noreferrer" : undefined);

  return (
    <a
      data-element-id={elementId}
      href={href || "#"}
      target={target}
      rel={safeRel}
      className={cn("text-primary underline-offset-4 hover:underline", classProp, className)}
    >
      {text || href}
    </a>
  );
};

export default LinkComponent;
