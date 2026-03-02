import { cn } from "@/lib/utils";

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
