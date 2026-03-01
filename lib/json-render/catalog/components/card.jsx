import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import { cn } from "@/lib/utils";

export const spec = {
  description:
    "Card component, used to group other components inside its children.",
  tags: ["Layout", "Content"],
  props: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      width: z.union([z.number().positive(), z.string()]).optional(),
      maxWidth: z.enum(["sm", "md", "lg", "xl", "2xl", "3xl"]).optional(),
      centered: z.boolean().optional(),
      layout: z.enum(["stack", "grid"]).optional().default("stack"),
      gap: z.enum(["0", "2", "4", "6", "8"]).optional().default("4"),
      columns: z.enum(["1", "2", "3", "4"]).optional().default("1"),
      className: z.string().optional(),
    })
    .toJSONSchema(),
};

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
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {/* <CardAction>Card Action</CardAction> */}
      </CardHeader>
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
