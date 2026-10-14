# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

A meal-tracker app that is currently an unmodified `create-next-app` scaffold: one route (`src/app/page.tsx`) with the default landing page, and the default `metadata` in `src/app/layout.tsx`. There is no data layer, API, or test setup yet.

## Commands

```bash
npm run dev     # dev server at http://localhost:3000 (Turbopack)
npm run build   # production build; also runs type checking
npm run start   # serve the production build
npm run lint    # ESLint (flat config: next core-web-vitals + typescript)
npx tsc --noEmit  # type-check without building
```

No test runner is configured.

## Stack and versions

- **Next.js 16.4 (App Router) + React 19.3 + TypeScript (strict)**. These are newer than most training data. The docs for the installed version are in `node_modules/next/dist/docs/` (`01-app/` covers the App Router). Check them before relying on remembered Next.js APIs.
- **Tailwind CSS v4**, CSS-first: there is no `tailwind.config.*`. Theme tokens live in `src/app/globals.css` under `@theme inline` and map the `--background`/`--foreground` CSS variables (with a `prefers-color-scheme: dark` override) to utilities such as `bg-background` and `text-foreground`. Tailwind is wired in through the `@tailwindcss/turbopack` loader rule in `next.config.ts`, not PostCSS.
- Fonts: Geist and Geist Mono via `next/font/google`, exposed as `--font-geist-sans` / `--font-geist-mono` and mapped to `font-sans` / `font-mono`.
- Import alias: `@/*` → `src/*`.

## Rendering model: Cache Components

`next.config.ts` enables `cacheComponents: true` and `partialPrefetching: true`. This changes how pages render compared to older Next.js:

- Caching is opt-in through the `"use cache"` directive (on data functions or components), paired with `cacheLife`. Do not use the old `fetch` caching or `export const revalidate` model. See `01-app/01-getting-started/08-caching.md` and `09-revalidating.md` in the bundled docs.
- Uncached dynamic data (request APIs, uncached fetches) must sit inside a `<Suspense>` boundary so the static shell can prerender. Otherwise the build or dev server reports an error.
- With Partial Prefetching, `<Link>` prefetches only the route's static/cached App Shell. Use `<Link prefetch={true}>` to also prefetch URL-specific cached content.
- `GET` Route Handlers follow the same prerendering model as pages.

## Authentication (Clerk)

- `@clerk/nextjs` v7, linked to the Clerk app "Meal Tracker" (`app_3KfpbswLXNJEpQIEakwfVyvQV0M`) through the Clerk CLI. Keys live in `.env.local` (gitignored). Use `clerk env pull` to restore them and `clerk doctor` to check the setup.
- `src/proxy.ts` (Next 16's rename of `middleware.ts`) runs `clerkMiddleware()`. Routes are public by default, so protect each page, Route Handler, or Server Action with `await auth.protect()` (from `@clerk/nextjs/server`).
- `ClerkProvider` sits inside `<body>` in `src/app/layout.tsx`. The header's auth controls also live there.
- Because Cache Components is on, Clerk components that read request or URL data need a `<Suspense>` boundary: the server `<Show>` (it calls `auth()`), and `<SignIn>`/`<SignUp>` (they call `usePathname()`). Anything that calls `auth()` or `currentUser()` needs one too.

## Conventions

- Layout and page props use the globally generated route types (e.g. `LayoutProps<"/">`, `PageProps<"/...">`), with no import needed. Next.js generates them into `.next/types` when you run `dev` or `build`.
