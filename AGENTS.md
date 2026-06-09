# Repository Guidelines

## Project Structure & Module Organization

This is a React + TypeScript + Vite app. Application code lives in `src/`, with the root component in `src/App.tsx` and the entry point in `src/main.tsx`. Global Tailwind CSS v4 styles and design tokens are in `src/index.css`. Reusable UI components belong in `src/components/`; shadcn/ui components are generated under `src/components/ui/`. Shared helpers belong in `src/lib/`, such as `src/lib/utils.ts`. Static public assets go in `public/`; imported source assets can live in `src/assets/`.

## Build, Test, and Development Commands

- `npm run dev`: start the Vite development server.
- `npm run build`: run TypeScript project build checks, then create a production Vite build.
- `npm run preview`: serve the production build locally for verification.
- `npm run lint`: run ESLint across the repository.
- `npm run typecheck`: run TypeScript checking without emitting files.
- `npm run format`: format `ts` and `tsx` files with Prettier.
- `npx shadcn@latest add button`: add shadcn/ui components; replace `button` with the desired component.

## Coding Style & Naming Conventions

Use TypeScript and TSX for application code. Components should use PascalCase names, hooks should use `useCamelCase`, and utility functions should use camelCase. Prefer the configured aliases from `components.json`, such as `@/components/ui/button` and `@/lib/utils`, instead of long relative paths. Keep styling in Tailwind utility classes and shared CSS variables in `src/index.css`. Use Prettier before submitting changes; Tailwind class ordering is handled by `prettier-plugin-tailwindcss`.

## Testing Guidelines

No test runner is currently configured. For now, validate changes with `npm run typecheck`, `npm run lint`, and `npm run build`. If adding tests, colocate them near the code they cover with names like `Component.test.tsx` or `utils.test.ts`, and add the test command to `package.json` so contributors have a single standard entry point.

## Commit & Pull Request Guidelines

The current history uses a Conventional Commit style prefix, for example `feat: initial commit`. Continue with short, imperative messages such as `fix: handle empty state` or `feat: add color picker`. Pull requests should include a clear summary, validation steps run, linked issues when applicable, and screenshots or screen recordings for visible UI changes.

## Agent-Specific Instructions

Keep changes scoped to the requested feature or fix. Do not edit generated dependencies such as `node_modules/` or build output such as `dist/`. When modifying shadcn/ui components, preserve the project’s Base UI, lucide icon, Tailwind, and CSS variable conventions.
