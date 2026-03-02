import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const CardComponent = ({
  title = "",
  description = "",
  width,
  maxWidth,
  centered = false,
  layout = "stack",
  gap = "4",
  columns = "1",
  className,
  elementId,
  children,
}) => {
  console.log({ elementId, className });
  return (
    <Card
      data-element-id={elementId}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
      }}
      className={cn(
        maxWidth === "sm" && "max-w-sm",
        maxWidth === "md" && "max-w-md",
        maxWidth === "lg" && "max-w-lg",
        maxWidth === "xl" && "max-w-xl",
        maxWidth === "2xl" && "max-w-2xl",
        maxWidth === "3xl" && "max-w-3xl",
        centered && "mx-auto",
        className,
      )}
    >
      {!title && !description ? null : (
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
          {/* <CardAction>Card Action</CardAction> */}
        </CardHeader>
      )}
      <CardContent>
        <div
          className={cn(
            layout === "stack" && "flex flex-col",
            layout === "grid" && "grid",
            layout === "grid" && columns === "1" && "grid-cols-1",
            layout === "grid" && columns === "2" && "grid-cols-2",
            layout === "grid" && columns === "3" && "grid-cols-3",
            layout === "grid" && columns === "4" && "grid-cols-4",
            gap === "0" && `gap-0`,
            gap === "2" && `gap-2`,
            gap === "4" && `gap-4`,
            gap === "6" && `gap-6`,
            gap === "8" && `gap-8`,
          )}
        >
          {children}
        </div>
        {/* <p>Card Content</p> */}
      </CardContent>
      {/* <CardFooter>
        <p>Card Footer</p>
      </CardFooter> */}
    </Card>
  );
};
export default CardComponent;
