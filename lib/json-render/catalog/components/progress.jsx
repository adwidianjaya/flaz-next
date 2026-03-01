import { z } from "zod";
import { cn } from "@/lib/utils";

export const spec = {
  description: "Linear progress bar for completion state.",
  tags: ["Content"],
  props: z
    .object({
      value: z.number().min(0).optional().default(0),
      max: z.number().positive().optional().default(100),
      tone: z
        .enum([
          "neutral",
          "primary",
          "secondary",
          "accent",
          "info",
          "success",
          "warning",
          "error",
        ])
        .optional()
        .default("neutral"),
      class: z.string().optional(),
      className: z.string().optional(),
    })
    .toJSONSchema(),
};

const ProgressComponent = ({
  value = 0,
  max = 100,
  tone = "neutral",
  class: classProp,
  className,
  elementId,
}) => {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div
      data-element-id={elementId}
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-muted",
        classProp,
        className,
      )}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className={cn(
          "h-full transition-all",
          tone === "neutral" && "bg-foreground/70",
          tone === "primary" && "bg-primary",
          tone === "secondary" && "bg-secondary",
          tone === "accent" && "bg-accent",
          tone === "info" && "bg-blue-500",
          tone === "success" && "bg-green-500",
          tone === "warning" && "bg-amber-500",
          tone === "error" && "bg-red-500",
        )}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};

export default ProgressComponent;
