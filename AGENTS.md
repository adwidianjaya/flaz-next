# Repository Guidelines

## Project Structure & Module Organization
`app/` contains the Next.js App Router surface: public page rendering in `app/[[...path]]`, editor flows in `app/~pages`, collection tools in `app/~collections`, and API handlers in `app/api/`. Shared UI lives in `components/`, with reusable primitives under `components/ui/`. Core logic is in `lib/`, especially `lib/db/` for Drizzle/PostgreSQL and `lib/json-render/` for prompt handling, schema conversion, and runtime rendering. Static assets live in `public/`. Treat `.next/`, `node_modules/`, and `tmp/` as generated or disposable.

## Build, Test, and Development Commands
Use Bun or npm scripts from the repo root:

- `bun dev` or `npm run dev` starts the local Next.js server.
- `bun build` or `npm run build` creates a production build.
- `bun start` or `npm run start` serves the production build.
- `bun lint` or `npm run lint` runs ESLint with the Next Core Web Vitals config.
- `bun db:push` or `npm run db:push` pushes `lib/db/schema.js` changes to PostgreSQL via Drizzle.

**No test suite is currently configured.** If you need to run a single test in the future (when tests are added), typical patterns would be:
- For Jest: `npx jest path/to/file.test.js`
- For Vitest: `npx vitest run path/to/file.test.js`

## Code Style Guidelines

### Language & Framework
- **JavaScript only** - No TypeScript (use `jsconfig.json` for path aliases)
- **Next.js 16** with App Router (`page.js`, `layout.js`, `route.js`)
- **React 19** with functional components
- **ES modules** (`import`/`export` syntax)

### Formatting
- **Indentation:** 2 spaces
- **Quotes:** Double quotes for strings
- **Semicolons:** Required at end of statements
- **Trailing commas:** Use in objects, arrays, and function parameters
- **Line length:** ~80-100 characters typical
- **File naming:**
  - Components: `kebab-case.jsx` (e.g., `prompt-input.jsx`, `page-table.jsx`)
  - Routes: Next.js convention (`page.js`, `layout.js`, `route.js`, `action.js`)
  - Utilities: `camelCase.js` (e.g., `path-utils.js`)

### Import Order
1. React imports first: `import * as React from "react"`
2. Next.js imports
3. Third-party libraries (grouped by package)
4. Absolute imports with `@/` alias
5. Relative imports for same-module files

Example:
```javascript
import * as React from "react";
import { useState } from "react";
import { cva } from "class-variance-authority";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { buildPagePathFromName } from "./path-utils";
```

### Component Patterns
Use functional components with destructured props and the `cn()` utility for class merging:

```javascript
function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
```

### Server Actions Pattern
```javascript
"use server";

import { db } from "@/lib/db/drizzle";
import { revalidatePath } from "next/cache";

export const createPage = async ({ name, path }) => {
  // Implementation
  revalidatePath("/~pages");
  return { success: true, page: result[0] };
};
```

### Styling
- **Tailwind CSS 4** with `@import` syntax in `globals.css`
- **Shadcn UI** components (New York style, baseColor: neutral)
- **CSS variables** using `oklch` color format
- Use `cn()` from `@/lib/utils` for conditional class merging
- Use `class-variance-authority` (cva) for component variants

### Database (Drizzle ORM)
```javascript
import { pgTable, uuid, text, json, timestamp, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const pageTable = pgTable(
  "__page",
  {
    id: uuid().primaryKey().notNull().default(sql`uuidv7()`),
    name: text(),
    path: text().unique(),
    schema: json(),
    created_at: timestamp({ withTimezone: true }).defaultNow(),
  },
  (table) => [index("__page_name_idx").on(table.name)]
);
```

### Error Handling
- Use `react-error-boundary` for React component error boundaries
- Return structured error objects from server actions: `{ success: false, error: "message" }`
- Use Zod for input validation before database operations

### State Management
- **Valtio** for primary application state
- **Zustand** for editor UI state
- **React hooks** (`useState`, `useEffect`) for local component state

## Testing Guidelines
There is currently no automated test suite configured. For now, treat linting plus targeted manual checks as the baseline: verify page editing, public rendering, and any affected API or database flow locally. When adding tests, colocate them near the feature or under a dedicated test directory and use `*.test.js` naming so they are easy to adopt later.

## Commit & Pull Request Guidelines
Recent history uses short, imperative commit subjects like `add logo` and `update colors`. Keep commits focused, lowercase is acceptable, and describe the shipped change directly. PRs should include a short summary, impacted routes or modules, environment or schema changes, and screenshots for UI work. Link the related issue when one exists.

**Always run `bun lint` before committing.**

## Security & Configuration Tips
Keep secrets in `.env`, not in source control. The app expects `DATABASE_URL`, provider API keys, and Unsplash credentials for AI/image flows. Review `drizzle.config.js` before pushing schema changes against shared databases.

## Path Aliases
Use `@/` prefix for absolute imports from project root:
- `@/components/*` → `components/*`
- `@/lib/*` → `lib/*`
- `@/app/*` → `app/*`

## Linting Configuration
ESLint uses the flat config format (`eslint.config.mjs`) with Next.js Core Web Vitals rules. Ignored directories: `.next/`, `out/`, `build/`, `next-env.d.ts`.

## Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- Provider API keys for AI flows (OpenAI, Anthropic, XAI, Google, OpenRouter)
- Unsplash credentials for image flows
