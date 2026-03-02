import { Badge } from "@/components/ui/badge";

const BadgeComponent = ({ label = "", variant = "default", className, elementId }) => {
  return (
    <Badge data-element-id={elementId} variant={variant} className={className}>
      {label}
    </Badge>
  );
};

export default BadgeComponent;
