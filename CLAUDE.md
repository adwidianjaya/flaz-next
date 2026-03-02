# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev          # Start development server
bun build        # Build for production
bun lint         # Run ESLint
bun db:push      # Push Drizzle schema to PostgreSQL
```

No test suite is configured.

## Environment

Requires a `.env` file with:
- `XAI_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, `OPENROUTER_API_KEY`
- `UNSPLASH_ACCESS_KEY`, `UNSPLASH_SECRET_KEY`
- `DATABASE_URL` (e.g. `postgresql://127.0.0.1:5432/flaz`)

## Architecture

**Flaz** is an AI-powered visual page builder. Users describe UI in natural language; an LLM generates component definitions that are immediately rendered in a preview.

### Core Data Flow

1. User types a prompt in `app/~pages/edit/[[...paths]]/prompt-input.jsx`
2. Request goes to `app/api/llm/route.js` → `lib/json-render/prompt.js`
3. LLM (Xai Grok by default, configurable) streams JSONL operations
4. Operations applied via `lib/json-render/utils.js:updateDefinitionByOperationString`
5. Updated definition → render schema via `lib/json-render/utils.js:convertDefinitionToRenderSchema`
6. Schema rendered by `lib/json-render/ui/renderer.jsx`
7. Page auto-saved to PostgreSQL via `app/~pages/edit/[[...paths]]/action.js`

### Key Data Structures

**Definition** (logical, what the LLM produces):
```js
{
  root: "element-id",
  states: { form: { email: "" } },
  elements: {
    "element-id": { type: "Button", props: { label: "Click" }, children: [] }
  }
}
```

**Schema** (render tree, derived from definition):
```js
{ elements: [{ type: "Button", props: {}, elementId: "...", children: [] }], states: {} }
```

### State Management

- **Valtio store** (`lib/json-render/ui/store.js`): holds `definition`, `schema`, `elements`, `states`, `logs`
- **Zustand**: secondary usage in editor UI
- **State binding in props**: `"{$states.form.email}"` (read) or expressions like `"{$states.x ? 'a' : 'b'}"` evaluated by `lib/json-render/template-engine.js`

### Component Catalog (`lib/json-render/catalog/components/`)

Each component has a `.jsx` file and a `.def.js` file. The def exports a `spec` object that drives LLM awareness and prop validation. All defs are aggregated in `defs.js`.

Def shape:
```js
export const spec = {
  description: "...",
  tags: ["Input", "Form", "Content", "Layout", "Action"],  // one or more
  props: z.object({ ... }).toJSONSchema(),
}
```

**Change handler convention**: `onChange${upperFirst(propName)}` (e.g. `value` → `onChangeValue`)

**Zod defaults**: Add `.default(...)` for enum canonical fallbacks and meaningful non-falsy values. Omit defaults for empty strings and falsy booleans — use local component defaults instead.

### Routes

- `/` or `/<path>` — Public viewer (`app/[[...path]]/page.js`)
- `/~pages/edit/<path>` — Editor (`app/~pages/edit/[[...paths]]/page.js`)
- `/~pages` — Pages explorer
- `/api/llm` — LLM streaming endpoint

### Database

Drizzle ORM with PostgreSQL. Schema in `lib/db/schema.js`:
- `pageTable` — active pages (id, name, path, schema JSON, definition JSON, timestamps)
- `pageDeletedTable` — soft-deleted pages

Config in `drizzle.config.js`.
