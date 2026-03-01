# Component Catalogs

Contains the component catalogs for the JSON Renderer.
Each component is defined by a `spec` object that contains the following properties:

- `description`: A brief description of the component.
- `tags`: Tags that describe the component. May contains one or more of the following tags:
  - `Input`: The component is used for form inputs.
  - `Content`: The component is used for content such as headings, paragraphs, and lists.
  - `Layout`: The component is used for layout such as containers, grids, and columns.
  - `Action`: The component is used for actions such as buttons, links, and navigation.
- `props`: A Zod schema that defines the properties of the component.
- `events`: An array of event names that the component emits.

The `spec` object is used to generate the JSON schema for the component, which is then used to validate the component props and events.

## Zod Schema Best Practices

Use schema defaults only when they represent a meaningful fallback that should apply at runtime even when props are missing.

- Keep defaults in `spec.props` for:
  - Enums that need a canonical fallback (for example `layout`, `type`, `direction`, `size`).
  - Non-falsy semantic values (for example `step: 1`, `max: 5`, `name: "filter"`).
  - Collections that should safely default (for example `options: []`, `values: []`) when needed.
- Avoid defaults in `spec.props` for:
  - Empty strings (for example `label`, `class`, `text`, `placeholder`) unless truly required as schema-level behavior.
  - Falsy booleans (for example `.default(false)`) when `false` is already the obvious absence state.

Keep readable local defaults in component `$bindable(...)` for developer clarity and onboarding.

Example pattern:

```js
props: z
  .object({
    layout: z.enum(["stack", "grid"]).optional().default("stack"),
    label: z.string().optional(),
    disabled: z.boolean().optional(),
  })
  .toJSONSchema(),
```

```js
const Container = ({
    layout: "stack",
    label: "",
    disabled: false,
}) => { ... }
```
