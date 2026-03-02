import { cn } from "@/lib/utils";

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
