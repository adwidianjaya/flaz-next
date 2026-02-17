import { z } from "zod";
import { cn } from "@/lib/utils";

const TextComponent = ({ text = "", level, className }) => {
  return (
    <div
      class={cn(
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

const spec = {
  description: "Plain text, with level such as heading or paragraph.",
  props: z
    .object({
      text: z.string().optional(),
      level: z.enum(["h1", "h2", "h3", "h4", "h5", "h6", "p"]).optional(),
      className: z.string().optional(),
    })
    .toJSONSchema(),
};

export { TextComponent as default, spec };
