import { z } from "zod";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const CardComponent = ({
  title = "",
  description = "",
  maxWidth,
  centered = false,
  children,
  className,
}) => {
  return (
    <Card
      size={maxWidth}
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
        {children}
        {/* <p>Card Content</p> */}
      </CardContent>
      {/* <CardFooter>
        <p>Card Footer</p>
      </CardFooter> */}
    </Card>
  );
};

const spec = {
  description:
    "Card component, used to group other components inside its children.",
  props: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      maxWidth: z.enum(["sm", "md", "lg", "xl", "2xl", "3xl"]).optional(),
      centered: z.boolean().optional().default(false),
      className: z.string().optional(),
    })
    .toJSONSchema(),
};

export { CardComponent as default, spec };
