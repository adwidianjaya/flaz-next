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

## Coding Style & Naming Conventions
This codebase is primarily JavaScript and JSX with ES modules. Follow the existing style: 2-space indentation, double quotes, semicolons, and functional React components. Use `page.js`, `layout.js`, and `route.js` for App Router entry points. Prefer kebab-style or route-driven folder names, and keep shared component filenames descriptive, such as `page-table.jsx` or `prompt-input.jsx`. Run `bun lint` before opening a PR.

## Testing Guidelines
There is currently no automated test suite configured. For now, treat linting plus targeted manual checks as the baseline: verify page editing, public rendering, and any affected API or database flow locally. When adding tests, colocate them near the feature or under a dedicated test directory and use `*.test.js` naming so they are easy to adopt later.

## Commit & Pull Request Guidelines
Recent history uses short, imperative commit subjects like `add logo` and `update colors`. Keep commits focused, lowercase is acceptable, and describe the shipped change directly. PRs should include a short summary, impacted routes or modules, environment or schema changes, and screenshots for UI work. Link the related issue when one exists.

## Security & Configuration Tips
Keep secrets in `.env`, not in source control. The app expects `DATABASE_URL`, provider API keys, and Unsplash credentials for AI/image flows. Review `drizzle.config.js` before pushing schema changes against shared databases.
