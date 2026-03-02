import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

const normalizeItems = (items = []) => {
  return (items || []).map((item) => {
    if (typeof item === "string") return { label: item, checked: false };
    return {
      label: item?.label || "",
      checked: Boolean(item?.checked),
    };
  });
};

const ListComponent = ({
  items = [],
  type = "ul",
  marker = "disc",
  class: classProp,
  className,
  elementId,
}) => {
  const normalizedItems = normalizeItems(items);
  const mergedClassName = cn(classProp, className);

  if (type === "ol") {
    return (
      <ol
        data-element-id={elementId}
        className={cn(
          "pl-5",
          marker === "none" && "list-none",
          marker === "disc" && "list-disc",
          (!marker || marker === "decimal") && "list-decimal",
          mergedClassName,
        )}
      >
        {normalizedItems.map((item, index) => (
          <li key={`${item.label}-${index}`} className="my-1">
            {item.label}
          </li>
        ))}
      </ol>
    );
  }

  if (type === "check") {
    return (
      <ul data-element-id={elementId} className={cn("space-y-2", mergedClassName)}>
        {normalizedItems.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            <Checkbox checked={item.checked} disabled />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul
      data-element-id={elementId}
      className={cn(
        "pl-5",
        marker === "none" && "list-none",
        marker === "disc" && "list-disc",
        marker === "decimal" && "list-decimal",
        mergedClassName,
      )}
    >
      {normalizedItems.map((item, index) => (
        <li key={`${item.label}-${index}`} className="my-1">
          {item.label}
        </li>
      ))}
    </ul>
  );
};

export default ListComponent;
