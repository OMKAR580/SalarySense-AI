# SalarySense AI - Frontend

## Project Overview
SalarySense AI is a production-grade AI SaaS Platform for Employee Salary Classification. This application provides a multi-tenant workspace, prediction dashboards, and role-based access for HR professionals.

## Architecture
This frontend is built inside a monorepo workspace to ensure separation of concerns. It implements a strict layered architecture:
- `components/` - Dumb, reusable UI elements.
- `features/` - Domain-specific modules containing their own state, api calls, and components.
- `services/` - External API integration and Axios clients.
- `store/` - Global state management (Zustand).
- `types/` - Shared TypeScript definitions.

## Tech Stack
- **Framework:** Next.js 15 (App Router), React 19
- **Language:** Strict TypeScript
- **Styling:** TailwindCSS, CSS Variables, class-variance-authority
- **Forms & State:** React Hook Form, Zod, Zustand, TanStack Query
- **Quality Tools:** ESLint, Prettier, Husky, lint-staged

## Setup Instructions
1. Install dependencies: `npm install`
2. Create environment file: `cp .env.example .env.local`
3. Start development server: `npm run dev`

## Scripts
- `npm run dev` - Starts local development server.
- `npm run build` - Builds production bundle.
- `npm run start` - Runs production bundle.
- `npm run lint` - Lints the codebase.

## Coding Standards
- **Strict TypeScript:** No implicit any, unused variables will fail the build.
- **Formatting:** Prettier runs automatically on pre-commit via Husky.
- **Imports:** Use absolute path aliases (e.g., `@/components/Button`).
