import { z } from "zod";
import { Button } from "@/components/ui/button";

const ButtonComponent = () => {
  return <Button>Hello</Button>;
};

const spec = {
  description: "Clickable button. Bind onclick to handle click events.",
  props: z
    .object({
      label: z.string().optional(),
      disabled: z.boolean().optional(),
      class: z.string().optional(),
    })
    .toJSONSchema(),
  events: ["onclick"],
};

export { ButtonComponent as default, spec };
