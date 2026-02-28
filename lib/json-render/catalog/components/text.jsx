import { z } from "zod";
import { cn } from "@/lib/utils";

export const spec = {
  description: "Plain text, with level such as heading or paragraph.",
  tags: ["Content"],
  props: z
    .object({
      text: z.string().optional(),
      level: z
        .enum(["h1", "h2", "h3", "h4", "h5", "h6", "p"])
        .optional()
        .default("p"),
      class: z.string().optional(),
    })
    .toJSONSchema(),
};

const TextComponent = ({ text = "", level = "p", className }) => {
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
      {props.text}
    </div>
  );
};
export default TextComponent;
