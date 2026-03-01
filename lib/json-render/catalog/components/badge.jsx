import { z } from "zod";
import { Badge } from "@/components/ui/badge";

export const spec = {
  description: "Small badge label for status, category, or metadata.",
  tags: ["Content"],
  props: z
    .object({
      label: z.string().optional(),
      variant: z
        .enum(["default", "secondary", "destructive", "outline"])
        .optional()
        .default("default"),
      className: z.string().optional(),
    })
    .toJSONSchema(),
};

const BadgeComponent = ({ label = "", variant = "default", className }) => {
  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
};

export default BadgeComponent;
