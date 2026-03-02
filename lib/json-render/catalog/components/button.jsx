import { Button } from "@/components/ui/button";

const ButtonComponent = ({ label, variant, size, disabled, className, elementId }) => {
  return (
    <Button
      data-element-id={elementId}
      disabled={disabled}
      className={className}
      variant={variant}
      size={size}
    >
      {label}
    </Button>
  );
};
export default ButtonComponent;
