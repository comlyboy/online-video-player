You are an expert in TypeScript, React, Next.js, Tailwind CSS, and Zustand. You write functional, maintainable, performant, and accessible code following React and Next.js best practices.

## Project shape

- This is a Next.js App Router project configured for static export (`output: "export"` in `next.config.ts`). Do not add features that require a Node.js server at runtime: no Route Handlers used as a live backend, no Server Actions, no ISR/on-demand revalidation, no dynamic routes without `generateStaticParams`, no middleware.
- `next/image` is configured with `images.unoptimized: true` since static export has no image optimization server.
- The dev server runs on port 4200 (`npm run dev`), not 3000. Keep it that way; port 3000 is reserved for other local tooling.

## TypeScript Best Practices

- Use strict type checking.
- Prefer `interface` over `type` for object shapes.
- Avoid the `any` type; use `unknown` when the type is uncertain.
- Use full, descriptive variable and function names instead of abbreviations, in English or any other language used in identifiers.
- Enum members are written in `SCREAMING_SNAKE_CASE`.

## React & Next.js Best Practices

- Default to Server Components. Only add `"use client"` when a component needs state, effects, browser APIs, or event handlers.
- React component function names end with `Component` (e.g. `HeaderComponent`, `VideoPlayerComponent`), and the file is named to match (`HeaderComponent.tsx`).
- Keep components small and focused on a single responsibility.
- Keep JSX/templates simple; push non-trivial logic into plain functions or hooks.
- Do not add a data-fetching or state-management abstraction until it is actually needed by more than one component.
- Do not use the `next-themes` package. Any dark/light or color-scheme switching is implemented manually with a data attribute on `<html>`, a small no-flash inline script in the root layout, and a Zustand store for the persisted preference.

## Styling

- Tailwind CSS v4, configured via `@theme inline` and CSS custom properties in `src/app/globals.css`.
- The app is dark-only; do not add a light theme. Visual variation (accent color, etc.) is done through swappable CSS custom properties driven by a `data-color-scheme` attribute on `<html>`, not by re-lightening the background.
- Prefer Tailwind utility classes over new CSS files. Only add rules to `globals.css` for things Tailwind utilities cannot express (custom properties, `@theme`, global resets).

## State Management

- Use Zustand for state that is shared across components or must persist across reloads (e.g. user preferences). Use the `persist` middleware for anything that should survive a page reload.
- Use local component state (`useState`) for state that belongs to a single component or a small, co-located subtree (e.g. form input, a page's "currently playing URL").
- Keep state transformations pure and predictable.

## Accessibility Requirements

- Must pass all AXE checks.
- Must follow WCAG AA minimums, including focus management, color contrast, and ARIA attributes.
- Interactive icon-only controls need an accessible name (`aria-label`) and correct `role`/`aria-*` state where relevant (e.g. `role="radiogroup"` and `aria-checked` for a swatch picker).
