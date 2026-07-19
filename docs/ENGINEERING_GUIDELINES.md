# SalarySense AI: Engineering Guidelines & Constitution

This document serves as the official engineering constitution for SalarySense AI. Following the Phase 0.4 freeze, **all future development must strictly adhere to these rules**. Any PR violating these standards must be rejected.

## 1. Architecture & Folder Structure
The Next.js `apps/web` project is structured hierarchically. Dependencies must only flow **downward**.

### Allowed Dependency Flow
`app/` → `features/` → `components/` (Shared UI) → `hooks/` → `utils/` → `constants/` → `types/`

### Forbidden Imports
- ❌ `Feature A` importing from `Feature B`
- ❌ `types/` importing from `components/`
- ❌ `hooks/` importing from `app/` (Pages)
- ❌ `components/` (Shared) importing from `features/`

### Folder Responsibilities
- **`app/`**: Next.js routing, layouts, error boundaries, and loading states. Must remain thin.
- **`features/`**: Domain-specific logic (e.g., `landing`, `dashboard`, `auth`). Contains its own components.
- **`components/ui/`**: Highly reusable, domain-agnostic UI elements (Buttons, Cards, Inputs).
- **`shared/`**: Modules used across multiple features but not strictly UI (e.g., wrappers).
- **`hooks/`**: Reusable React logic (`useTypewriter`, `useProgressAnimation`).
- **`utils/`**: Pure functions, data transformers, and validation helpers.
- **`services/`**: API calls, external integrations, and fetch logic.
- **`animations/`**: Centralized Framer Motion variants and transitions.
- **`constants/`**: Static data, marketing copy, and configuration values.
- **`types/`**: Global TypeScript interfaces and type definitions.
- **`providers/`**: Context providers (Theme, Auth, Query).
- **`config/`**: Environment parsing and global application config.
- **`styles/`**: Global CSS, Tailwind configuration, and design tokens.

## 2. Component Standards
- **Size Limit**: Components must not exceed 250-300 lines of code. If larger, extract sub-components or custom hooks.
- **Single Responsibility**: A component should do one thing. Presentational components should not fetch data.
- **Composition over Inheritance**: Pass `children` or explicit React nodes rather than passing deeply nested configuration objects.
- **No Duplication**: If a UI pattern repeats >2 times, abstract it into `components/ui/`.
- **Hooks Extraction**: If `useEffect` or `useState` logic becomes complex, extract it into a custom hook in `hooks/`.

## 3. Coding Standards & Naming Conventions
- **TypeScript**: Strict mode enforced. `any` is strictly forbidden. 
- **Files/Folders**:
  - Components/Pages: `PascalCase.tsx`
  - Hooks: `camelCase.ts` (prefix with `use`)
  - Utils/Constants: `camelCase.ts`
  - Directories (Features): `camelCase` or `kebab-case`
- **Interfaces**: `PascalCase` without the `I` prefix (e.g., `User`, not `IUser`).
- **Enums**: `PascalCase` for name, `UPPER_SNAKE_CASE` for values.
- **Constants**: `UPPER_SNAKE_CASE` for global static values.
- **Imports**: Must be sorted via `simple-import-sort`. (React/Next first, absolute third-party, absolute internal `@/`, relative imports).

## 4. Animation Standards
- **Centralization**: All generic motion variants must reside in `animations/` (e.g., `fadeUpVariant`, `floatingAnimation`).
- **Inline Configs**: ❌ Forbidden. Use imported variants.
- **Reduced Motion**: All animated components must use `useReducedMotion()` from Framer Motion. If `true`, animations must degrade gracefully to static states (duration 0).
- **Cleanup**: Frame loops and intervals must explicitly clear on unmount to prevent GPU/Memory leaks.

## 5. Design System Freeze
The visual language is locked via `globals.css` CSS variables.
- **Hardcoded Colors**: ❌ Forbidden (e.g., `text-[#030712]`).
- **Tokens Required**: Use `--color-landing-bg`, `--color-landing-surface`, `--color-primary`, etc.
- **Typography**: `Inter` (sans) and `JetBrains Mono` (mono).
- **Spacing/Grid**: Rely strictly on Tailwind's default numeric scaling (`gap-4`, `p-6`).

## 6. Performance Rules
- **Server Components**: Used by default.
- **Client Boundaries**: `"use client"` pushed to the furthest leaf node possible.
- **Lazy Loading**: Below-the-fold components must use `next/dynamic`.
- **Assets**: Use `<Image>` with `priority` strictly for LCP (Largest Contentful Paint) elements above the fold.
- **Memoization**: Only use `React.memo` or `useMemo` when rendering bottlenecks are proven via React Profiler. No premature optimization.

## 7. Accessibility (a11y) Rules
- **Semantic HTML**: `<nav>`, `<main>`, `<section>`, `<article>` over generic `<div>`.
- **Keyboard Navigation**: All interactive elements must be focusable.
- **ARIA**: Use `aria-label` for icon-only buttons. Use `aria-hidden="true"` for decorative SVGs.
- **Contrast**: Text must maintain a minimum WCAG AA contrast ratio against backgrounds.

## 8. Security Rules
- **Environment Variables**: Client-safe variables must use `NEXT_PUBLIC_`. Secrets must remain strictly server-side.
- **Validation**: API inputs and environment variables must be parsed/validated using Zod (`src/config/env.ts`).
- **Authentication**: Future APIs must implement strict JWT / session validation.

## 9. Future ML Integration Guidelines
*Phase 1 preparation standards:*
- **Backend**: FastAPI for heavy Python-based inference.
- **APIs**: Salary prediction endpoints must support asynchronous polling or WebSockets for heavy model loads.
- **Data Transfer**: Use secure, validated JSON. For bulk CSV upload, implement streaming parsing on the backend to avoid memory overflow.
- **Versioning**: Models must be versioned in API routes (e.g., `/api/v1/predict/model-alpha`).

## 10. Testing Strategy
*To be implemented in Phase 1:*
- **Unit Testing**: Vitest/Jest for pure functions (`utils/`) and custom `hooks/`.
- **Component Testing**: React Testing Library for `components/ui/`.
- **E2E Testing**: Playwright/Cypress for critical user journeys (Authentication, Prediction flow).
- **Accessibility**: Axe-core integrations in the CI pipeline.

## 11. CI/CD Roadmap
Every Pull Request must pass:
1. `npm run lint` (ESLint + simple-import-sort)
2. `tsc --noEmit` (Strict Type Check)
3. `npx madge --circular src/` (Dependency Check)
4. `npm run build` (Next.js compilation)
*Future:* Unit Tests, E2E Tests, Bundle Analysis.

---
**Status**: 🔒 FROZEN as of Phase 0.4.
