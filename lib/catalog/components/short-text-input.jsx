import { z } from "zod";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const ShortTextInputComponent = ({
  label = "",
  description = "",
  disabled = false,
  placeholder = "",
  value,
  onChangeValue,
}) => {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="fieldgroup-name">{label}</FieldLabel>
        <Input
          id="fieldgroup-name"
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={(e) => {
            if (e) e.preventDefault();
            onChangeValue?.(e?.target?.value);
          }}
        />
        {description && <FieldDescription>{description}</FieldDescription>}
      </Field>
      {/* <Field>
        <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
        <Input
          id="fieldgroup-email"
          type="email"
          placeholder="name@example.com"
        />
        <FieldDescription>
          We&apos;ll send updates to this address.
        </FieldDescription>
      </Field>
      <Field orientation="horizontal">
        <Button type="reset" variant="outline">
          Reset
        </Button>
        <Button type="submit">Submit</Button>
      </Field> */}
    </FieldGroup>
  );
};

const spec = {
  description: "Short text, single line input.",
  props: z
    .object({
      label: z.string().optional(),
      description: z.string().optional(),
      placeholder: z.string().optional(),
      disabled: z.boolean().optional(),
      value: z.string().optional(),
    })
    .toJSONSchema(),
  // events: ["oninput"],
};

export { ShortTextInputComponent as default, spec };
