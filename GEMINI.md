# Flaz: AI-Powered Visual Page Builder

## Project Overview
Flaz is an AI-powered visual page builder where users describe UI in natural language, and an LLM generates component definitions that are rendered in real-time. It is built with Next.js and uses a custom JSON-based rendering engine.

### Key Features
- **Natural Language UI Generation:** Prompt-to-UI workflow using LLMs (Xai Grok, OpenAI, Anthropic, etc.).
- **Dynamic Rendering Engine:** Converts logical `definitions` into a renderable `schema`.
- **Reactive State Management:** Uses Valtio for a mutable yet reactive state store.
- **Component Catalog:** A collection of spec-driven components that the LLM is aware of.

## Core Technologies
- **Framework:** Next.js 16 (App Router)
- **Runtime:** Bun
- **Database:** PostgreSQL with Drizzle ORM
- **State Management:** Valtio (Primary), Zustand (Editor UI)
- **Styling:** Tailwind CSS 4, Radix UI, Lucide Icons
- **Validation:** Zod (used for component specs and prop validation)
- **AI Integration:** AI SDK (`ai`), OpenRouter

## Building and Running

### Commands
```bash
bun dev          # Start development server
bun build        # Build for production
bun lint         # Run ESLint
bun db:push      # Push Drizzle schema to PostgreSQL
```

### Environment Setup
Requires a `.env` file with:
- `DATABASE_URL`: PostgreSQL connection string.
- `XAI_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, `OPENROUTER_API_KEY`: For LLM features.
- `UNSPLASH_ACCESS_KEY`, `UNSPLASH_SECRET_KEY`: For image sourcing.

## Architecture & Data Flow

### 1. Definition vs. Schema
- **Definition:** The logical source of truth produced by the LLM. It contains `root`, `states`, and an `elements` map (flat structure).
- **Schema:** The hierarchical render tree derived from the definition.

### 2. Core Data Flow
1. **Prompt:** User inputs a prompt in the editor.
2. **LLM Request:** Sent to `/api/llm` which streams JSONL operations.
3. **Update:** Operations are applied to the `definition` via `updateDefinitionByOperationString`.
4. **Transform:** Definition is converted to a `schema` via `convertDefinitionToRenderSchema`.
5. **Render:** `Renderer` component maps the schema to React components from the catalog.
6. **Persistence:** Pages are saved to the `__page` table in PostgreSQL.

### 3. State Management (`lib/json-render/ui/store.js`)
- The **Valtio store** holds the `definition`, `schema`, and application `states`.
- Components bind to paths in `$states` (e.g., `{$states.form.name}`).
- `SimpleTemplatingEngine` evaluates expressions and bindings in props.

## Component Catalog (`lib/json-render/catalog/components/`)
Each component consists of two files:
1.  **`[name].jsx`**: The React component implementation.
2.  **`[name].def.js`**: Exported `spec` defining descriptions, tags, and Zod-validated props for LLM consumption.

### Component Conventions
- **Prop Binding:** Use `onChange[PropName]` convention for reactive updates (e.g., `value` prop uses `onChangeValue`).
- **Zod Specs:** Use `.default(...)` in Zod schemas for enums. Avoid defaults for empty strings or booleans to rely on component-level fallbacks.
- **Tags:** Components should have tags like `Action`, `Form`, `Content`, `Layout`, or `Input`.

## Project Structure
- `app/`: Next.js routes and pages.
    - `~pages/`: Editor and page management.
    - `~collections/`: Data collection management.
    - `[[...path]]/`: Dynamic public viewer.
- `lib/json-render/`: Core engine logic (renderer, store, utils, template engine).
- `components/ui/`: Shared UI components (Shadcn UI).
- `lib/db/`: Drizzle schema and database configuration.
