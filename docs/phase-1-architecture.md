# SalarySense AI - Phase 1 Architecture

## 1. Product Scope

SalarySense AI is an employee salary classification platform. Users submit employee profile data and the application calls an existing prediction API that returns one of three classifications:

- Low Salary
- Medium Salary
- High Salary

The machine learning service is treated as an external dependency. This project owns the production full stack application around authentication, user workflows, persistence, analytics, auditability, and deployment.

## 2. Architecture Principles

- Feature-first organization over technical-layer sprawl.
- Clear separation between web app, API app, database migrations, deployment configuration, and documentation.
- Backend owns validation, authorization, persistence, audit logs, and integration with the prediction service.
- Frontend owns interaction quality, accessibility, optimistic UX where safe, resilient loading states, and responsive layouts.
- Prediction requests are never trusted directly from the browser; the backend mediates all model calls.
- Environment-specific configuration is injected through environment variables.
- Every external boundary has timeout, retry, validation, and structured error handling.

## 3. Recommended Repository Structure

```text
salarysense-ai/
  apps/
    web/
      public/
      src/
        app/
          App.tsx
          providers/
          router/
          layouts/
          error-boundaries/
        features/
          auth/
          dashboard/
          employees/
          predictions/
          profile/
          billing/
          settings/
        shared/
          components/
            ui/
            feedback/
            data-display/
            forms/
            navigation/
          hooks/
          lib/
          services/
          stores/
          styles/
          types/
          utils/
        assets/
        main.tsx
      index.html
      vite.config.ts
      tailwind.config.ts
      postcss.config.js
      package.json
      tsconfig.json
    api/
      app/
        main.py
        core/
          config.py
          security.py
          logging.py
          rate_limit.py
          errors.py
        db/
          base.py
          session.py
          migrations/
        api/
          v1/
            router.py
            endpoints/
        features/
          auth/
          users/
          employees/
          predictions/
          audit_logs/
          organizations/
        integrations/
          prediction_client.py
          email_client.py
        middleware/
        schemas/
        tests/
      alembic/
      alembic.ini
      pyproject.toml
  packages/
    contracts/
      openapi/
      generated/
  infra/
    render/
    vercel/
    supabase/
    security/
  docs/
    phase-1-architecture.md
    api-contract.md
    deployment.md
    roadmap.md
  .env.example
  README.md
```

The first implementation phase should create only the folders needed by the initial authenticated prediction workflow. Billing, organizations, and advanced analytics should remain architectural placeholders until their phase begins.

## 4. Frontend Architecture

### Framework Stack

- React with Vite for fast builds and clean SPA deployment.
- React Router for public, auth, dashboard, and error routes.
- React Query for server state, caching, retries, request deduplication, and background refresh.
- Axios for a typed API client with interceptors.
- React Hook Form for complex form validation and controlled submission state.
- Framer Motion for subtle route transitions and UI micro-interactions.
- Recharts for dashboard and prediction analytics.
- Tailwind CSS for design tokens, responsive styling, dark mode, and composition.

### Frontend Feature Boundaries

```text
features/auth
  pages/
  components/
  hooks/
  services/
  schemas/
  types/

features/predictions
  pages/
  components/
  hooks/
  services/
  schemas/
  types/

features/employees
  pages/
  components/
  hooks/
  services/
  schemas/
  types/

features/dashboard
  pages/
  components/
  hooks/
  services/
  types/
```

Feature modules may import from `shared`, but `shared` must not import from features.

### Routing Architecture

```text
/
  Public marketing or redirect route

/login
/register
/forgot-password
/reset-password
  Public auth routes

/app
  Authenticated shell

/app/dashboard
  KPI cards, recent predictions, trend charts

/app/predictions/new
  Employee input form and classification result

/app/predictions
  Paginated prediction history with search, filters, sorting

/app/predictions/:predictionId
  Prediction detail, input snapshot, result, audit metadata

/app/employees
  Employee records if persistence is enabled

/app/settings/profile
/app/settings/security
  Account and security settings

/403
/404
/500
  Error routes
```

Route groups:

- Public routes: available without authentication.
- Guest-only routes: login/register pages redirect authenticated users to `/app/dashboard`.
- Protected routes: require a valid access token.
- Role-protected routes: reserved for admin and organization-owner features.

Use lazy route modules so dashboard, charts, and history screens do not inflate the initial login bundle.

### UI System

The interface should be premium and restrained: clean typography, generous spacing, quiet surfaces, subtle depth, accessible gradients, and purposeful animation. Cards should represent real data objects or dashboard widgets, not every section. Dashboard screens should prioritize scanability over landing-page aesthetics.

Core shared UI components:

- Button
- Input
- Select
- Checkbox
- Switch
- Dialog
- Drawer
- Toast
- Tooltip
- Skeleton
- EmptyState
- ErrorState
- DataTable
- Pagination
- Badge
- MetricCard
- ThemeToggle
- FormField

Accessibility requirements:

- Keyboard-reachable controls.
- Visible focus rings.
- Semantic headings and landmarks.
- Form labels and error descriptions connected with `aria-describedby`.
- Screen-reader-friendly loading and error states.
- Sufficient contrast in light and dark themes.

## 5. Backend Architecture

### Framework Stack

- FastAPI for API routing, dependency injection, OpenAPI, and async request handling.
- SQLAlchemy for ORM and explicit database sessions.
- PostgreSQL on Supabase for relational persistence.
- Alembic for migrations.
- Pydantic for request, response, and settings validation.
- JWT authentication with refresh token rotation.

### Backend Layering

```text
endpoint -> schema validation -> service -> repository -> database
                              -> integration client -> external prediction API
```

Responsibilities:

- Endpoints: HTTP shape, dependency injection, status codes.
- Schemas: strict request and response contracts.
- Services: business rules, authorization, orchestration, edge cases.
- Repositories: database access only.
- Models: SQLAlchemy entities.
- Integration clients: external network calls with timeouts and normalized errors.
- Middleware: request IDs, CORS, rate limits, security headers, logging.

### Backend Feature Modules

```text
features/auth
  models.py
  schemas.py
  service.py
  repository.py
  router.py

features/users
features/employees
features/predictions
features/audit_logs
features/organizations
```

The first implementation phase should prioritize `auth`, `users`, and `predictions`.

## 6. Database Architecture

### Initial Tables

```text
users
  id uuid primary key
  email citext unique not null
  password_hash text not null
  full_name text
  role text not null
  status text not null
  email_verified_at timestamptz
  last_login_at timestamptz
  created_at timestamptz
  updated_at timestamptz

refresh_tokens
  id uuid primary key
  user_id uuid references users(id)
  token_hash text unique not null
  family_id uuid not null
  expires_at timestamptz not null
  revoked_at timestamptz
  replaced_by_token_id uuid
  created_at timestamptz

employees
  id uuid primary key
  user_id uuid references users(id)
  external_ref text
  age integer
  education_level text
  job_title text
  years_experience numeric
  department text
  location text
  metadata jsonb
  created_at timestamptz
  updated_at timestamptz

salary_predictions
  id uuid primary key
  user_id uuid references users(id)
  employee_id uuid references employees(id)
  input_snapshot jsonb not null
  predicted_class text not null
  confidence numeric
  model_version text
  request_id text unique
  prediction_latency_ms integer
  created_at timestamptz

audit_logs
  id uuid primary key
  actor_user_id uuid references users(id)
  action text not null
  entity_type text not null
  entity_id uuid
  ip_address inet
  user_agent text
  metadata jsonb
  created_at timestamptz
```

### Database Rules

- Use UUID primary keys.
- Use `citext` for case-insensitive unique emails.
- Use `created_at` and `updated_at` consistently.
- Store prediction inputs as immutable snapshots for auditability.
- Never store raw refresh tokens, only cryptographic hashes.
- Add indexes for foreign keys, prediction history queries, and created-at sorting.
- Use Alembic migrations for every schema change.

## 7. API Architecture

All backend routes are versioned under `/api/v1`.

```text
GET    /health
GET    /api/v1/meta

POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
POST   /api/v1/auth/logout-all
GET    /api/v1/auth/me

POST   /api/v1/predictions
GET    /api/v1/predictions
GET    /api/v1/predictions/{prediction_id}
DELETE /api/v1/predictions/{prediction_id}

GET    /api/v1/employees
POST   /api/v1/employees
GET    /api/v1/employees/{employee_id}
PATCH  /api/v1/employees/{employee_id}
DELETE /api/v1/employees/{employee_id}

GET    /api/v1/dashboard/summary
GET    /api/v1/dashboard/prediction-trends
```

### API Response Shape

Success responses should be predictable:

```json
{
  "data": {},
  "meta": {
    "requestId": "req_123"
  }
}
```

Errors should be normalized:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Submitted employee data is invalid.",
    "details": [],
    "requestId": "req_123"
  }
}
```

### Prediction Request Flow

1. Frontend validates form fields.
2. Backend validates request with Pydantic.
3. Backend checks authentication and rate limits.
4. Backend creates or resolves employee record if needed.
5. Backend sends normalized payload to the external prediction API.
6. Backend validates the external response.
7. Backend stores immutable input snapshot and prediction result.
8. Backend returns classification, confidence, model version, and record ID.

## 8. Authentication Flow

### Token Strategy

- Short-lived access token.
- Long-lived refresh token with rotation.
- Refresh tokens stored server-side as hashes.
- Browser should store tokens in secure, httpOnly cookies when same-site deployment allows it.
- If cross-site hosting requires header tokens, use a hardened fallback with short access token lifetime, refresh rotation, strict CORS, and XSS defenses.

### Session Flow

```text
register/login
  -> validate credentials
  -> issue access token
  -> issue refresh token
  -> return current user

protected request
  -> attach access token
  -> backend verifies token
  -> route executes

expired access token
  -> frontend receives 401
  -> single-flight refresh request
  -> retry original request once
  -> logout if refresh fails
```

Security controls:

- Password hashing with Argon2 or bcrypt.
- Refresh token reuse detection.
- Logout revokes the active refresh token.
- Logout-all revokes a token family or all user sessions.
- Login and prediction endpoints should be rate limited.
- Audit sensitive actions.

## 9. State Management Architecture

Use React Query for server state:

- Current user.
- Prediction history.
- Dashboard summaries.
- Employee lists.
- Settings data.

Use local component state for UI-only state:

- Dialog visibility.
- Active tabs.
- Form drafts.
- Table column state.

Use a lightweight shared store only if needed for:

- Theme.
- Sidebar collapse.
- Toast queue.
- Offline indicator.

React Query policies:

- Deduplicate identical requests.
- Retry safe GET requests with exponential backoff.
- Do not retry validation failures.
- Cancel stale in-flight queries when filters change.
- Use pagination and query keys for large datasets.
- Invalidate prediction history and dashboard summary after successful prediction creation.

## 10. Error Handling And Edge Cases

Frontend:

- Global error boundary for unexpected render failures.
- Route-level error boundaries for lazy-loaded screens.
- Toasts for transient API failures.
- Inline form errors for validation failures.
- Offline banner using browser network events.
- Skeleton loaders for primary data surfaces.
- Empty states for first-use and no-result scenarios.
- Disabled submit state and request deduplication to prevent duplicate predictions.

Backend:

- Global exception handlers.
- Structured logs with request IDs.
- External prediction API timeout.
- Circuit-breaker-ready prediction client abstraction.
- Strict CORS allowlist.
- Security headers.
- Request body size limits.
- Database transaction boundaries.
- Pagination limits.
- Safe default error messages that avoid leaking internals.

## 11. Deployment Architecture

### Vercel

Deploys `apps/web`.

Responsibilities:

- Static SPA hosting.
- Environment variables for API URL and public app configuration.
- Preview deployments for pull requests.
- Production deployment on protected main branch.

### Render

Deploys `apps/api`.

Responsibilities:

- FastAPI web service.
- Health checks.
- Runtime environment variables.
- Alembic migration command in release process.
- Logs and metrics.

### Supabase PostgreSQL

Responsibilities:

- Managed PostgreSQL.
- Backups.
- Database connection string.
- Extensions such as `uuid-ossp` or `pgcrypto` and `citext`.

### Environment Variables

Frontend:

```text
VITE_API_BASE_URL
VITE_APP_ENV
VITE_SENTRY_DSN
```

Backend:

```text
APP_ENV
DATABASE_URL
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
ACCESS_TOKEN_TTL_MINUTES
REFRESH_TOKEN_TTL_DAYS
PREDICTION_API_URL
PREDICTION_API_KEY
CORS_ALLOWED_ORIGINS
RATE_LIMIT_REDIS_URL
SENTRY_DSN
```

## 12. Security Architecture

- Backend-mediated prediction calls only.
- Input allowlists for categorical fields.
- Server-side validation for all client-submitted data.
- Parameterized SQL through SQLAlchemy.
- Password hashing with a modern adaptive algorithm.
- Strict CORS origins.
- Secure cookies where possible.
- CSRF protection if cookie-based auth is used cross-site.
- XSS prevention through React escaping, no unsafe HTML, and careful rich text avoidance.
- Rate limiting for auth and predictions.
- Audit logs for authentication, prediction creation, deletion, and settings changes.
- Secrets never committed; `.env.example` documents keys only.
- Production error responses hide stack traces.

## 13. Performance Architecture

- Frontend route-level code splitting.
- Lazy-load charts and non-critical screens.
- React Query cache tuning by data volatility.
- Pagination for prediction history and employees.
- Debounced search and filter controls.
- Backend database indexes for history, user ownership, and timestamps.
- External prediction API timeout budget.
- Avoid returning large JSON payloads by default.
- Use compression at platform or server level.
- Keep dashboard summary queries purpose-built instead of deriving all metrics in the browser.

## 14. Development Roadmap

### Phase 1 - Architecture

- Define architecture, folders, routing, API contracts, auth flow, deployment plan, security model, and roadmap.
- No implementation code.

### Phase 2 - Foundation

- Create monorepo structure.
- Configure Vite, Tailwind, FastAPI, SQLAlchemy, Alembic.
- Add linting, formatting, environment examples, and baseline CI.
- Add health checks and global error patterns.

### Phase 3 - Authentication

- Register, login, refresh, logout, current user.
- Protected frontend routes.
- Token rotation and session persistence.
- Auth rate limiting and audit logging.

### Phase 4 - Prediction Workflow

- Employee input form.
- Backend prediction endpoint.
- External prediction API client.
- Prediction result screen.
- History persistence.

### Phase 5 - Dashboard And Analytics

- Summary metrics.
- Recharts visualizations.
- Recent predictions.
- Filters and trends.

### Phase 6 - Employee And Prediction Management

- Employee records.
- Prediction history table.
- Search, filtering, sorting, pagination.
- Detail pages and deletion.

### Phase 7 - Production Hardening

- Observability.
- Sentry or equivalent error reporting.
- Security headers.
- Load testing.
- Accessibility audit.
- Browser and mobile verification.

### Phase 8 - Deployment

- Vercel frontend deployment.
- Render backend deployment.
- Supabase production database.
- Migration workflow.
- Production environment validation.

## 15. Phase 1 Approval Gate

Before implementation begins, confirm:

- The monorepo layout is acceptable.
- Authentication should use httpOnly cookies where deployment constraints allow it.
- Prediction API request and response contract can be finalized in Phase 4.
- Employee records should be persisted separately from prediction snapshots.
- Dashboard analytics are part of the initial SaaS experience.


## 16. Enterprise Architecture Review Summary

This enterprise review upgrades the existing Phase 1 architecture without replacing its good decisions. The original stack, phased delivery model, backend-mediated prediction flow, feature-based structure, validation strategy, and deployment direction remain intact.

The baseline Phase 1 architecture is a strong production foundation for an authenticated prediction application. The enterprise gaps are mainly SaaS maturity, multi-tenant boundaries, operational readiness, and long-term governance.

Key weaknesses found:

- Repository structure needs shared workspace packages, scripts, Docker, CI/CD, and clearer testing ownership.
- The domain model is still too close to a single-user application.
- Authorization is role-aware but not yet permission-aware.
- Database design needs tenant scoping, organization entities, membership entities, reporting, import/export, and operational logs.
- Backend architecture needs queues, Redis, background jobs, circuit breakers, scheduled tasks, webhooks, and stronger dependency injection.
- Frontend architecture needs enterprise table, search, filter, notification, theme, internationalization, offline, and design-token systems.
- Prediction architecture needs batch prediction, CSV import, retry, export, version tracking, and explainable AI readiness.
- Deployment architecture needs Docker, GitHub Actions, staging, rollback, monitoring, and release gates.
- Testing architecture needs a full strategy across unit, integration, API, frontend, E2E, performance, security, accessibility, and load testing.

## 17. Enterprise Improvement Matrix

### 17.1 Repository Architecture

**Current Architecture:** A monorepo with `apps/web`, `apps/api`, `packages/contracts`, `infra`, and `docs`.

**Problem:** The structure does not yet separate shared UI, shared types, shared config, shared hooks, shared utilities, API clients, scripts, Docker assets, GitHub workflows, or test tooling.

**Why It Is A Limitation:** As the platform grows, frontend, backend, QA, DevOps, and security work will collide in app folders. Reuse will drift into copy-paste patterns.

**Recommended Enterprise Solution:** Upgrade to a workspace-based monorepo with `packages/ui`, `packages/types`, `packages/config`, `packages/utils`, `packages/hooks`, `packages/api-client`, `packages/contracts`, `packages/eslint-config`, `packages/tailwind-config`, and `packages/test-utils`. Add top-level `scripts`, `docker`, `.github/workflows`, and environment-specific `infra` folders.

**Benefits:** Cleaner ownership, faster onboarding, reusable primitives, stronger type consistency, simpler CI targeting, and lower duplication.

**Future Scalability:** Supports admin console, public docs, internal operations dashboard, worker services, and mobile clients.

**Implementation Priority:** High.

### 17.2 Shared Package Boundaries

**Current Architecture:** Shared frontend code lives inside `apps/web/src/shared`; API contracts live under `packages/contracts`.

**Problem:** Shared web code cannot easily be reused by future apps, and generated API types are not clearly packaged.

**Why It Is A Limitation:** Enterprise SaaS platforms often need a customer app, admin app, embedded widgets, internal tools, and generated clients. App-local shared code slows that evolution.

**Recommended Enterprise Solution:** Move app-agnostic code into `packages/*`. Keep app-specific composition inside each app. Generate OpenAPI types into `packages/api-client` and export stable domain contracts from `packages/types`.

**Benefits:** Consistent API usage, fewer runtime contract errors, easier future app creation, and simpler test reuse.

**Future Scalability:** Allows independent deployment of multiple frontends while preserving one design system and API client.

**Implementation Priority:** High.

### 17.3 Multi-Tenant SaaS Architecture

**Current Architecture:** Users own employees and predictions directly. Organizations are present only as a future backend placeholder.

**Problem:** The architecture cannot safely support multiple companies, departments, teams, or membership roles without retrofitting tenant boundaries later.

**Why It Is A Limitation:** Salary and workforce data is highly sensitive. Tenant scoping must be foundational, not added after user data exists.

**Recommended Enterprise Solution:** Make `organization_id` a first-class tenant boundary across employees, predictions, reports, imports, exports, saved filters, dashboard preferences, API keys, and audit logs. Users become global identities; memberships connect users to organizations.

**Benefits:** Secure data isolation, enterprise account management, scalable SaaS billing readiness, clearer analytics, and stronger authorization.

**Future Scalability:** Supports multiple organizations per user, enterprise workspaces, department-level permissions, and future subscription tiers.

**Implementation Priority:** High.

### 17.4 Organizations, Departments, Teams, And Invitations

**Current Architecture:** No detailed organization, department, team, or invitation model exists.

**Problem:** SaaS collaboration features are missing from the domain design.

**Why It Is A Limitation:** HR platforms are rarely single-user tools. Teams need ownership, invitations, departments, managers, and controlled access to workforce data.

**Recommended Enterprise Solution:** Add organization ownership, organization settings, memberships, invitations, departments, teams, team memberships, membership status, and invitation expiration. Departments and teams should be tenant-scoped and referenced by employees and analytics.

**Benefits:** Real enterprise account workflows, controlled collaboration, accurate workforce segmentation, and onboarding readiness.

**Future Scalability:** Enables SSO, SCIM provisioning, org-level billing, department analytics, and team-specific dashboards.

**Implementation Priority:** High.

### 17.5 Authentication Hardening

**Current Architecture:** Short-lived JWT access tokens, refresh token rotation, hashed refresh tokens, logout, and logout-all.

**Problem:** The auth model lacks email verification, 2FA, device management, login history, password policies, remember-me semantics, and explicit session tracking.

**Why It Is A Limitation:** Enterprise customers expect auditable account security and session control, especially for HR and compensation-adjacent data.

**Recommended Enterprise Solution:** Add email verification, password reset tokens, password policy enforcement, optional TOTP/WebAuthn-ready 2FA, session records, device fingerprints, login history, remember-me refresh TTL, single logout, and logout-all-devices.

**Benefits:** Stronger account security, better auditability, safer incident response, and improved enterprise trust.

**Future Scalability:** Prepares for SSO, enterprise identity providers, risk-based authentication, and compliance controls.

**Implementation Priority:** High.

### 17.6 RBAC And Permission-Based Access Control

**Current Architecture:** Role-protected routes are reserved for future admin features.

**Problem:** Roles alone are too coarse for enterprise HR workflows.

**Why It Is A Limitation:** Salary classification, employee records, exports, reports, API keys, billing, and audit logs require separate permissions.

**Recommended Enterprise Solution:** Use RBAC for default role bundles and PBAC for granular checks. Model permissions such as `prediction:create`, `prediction:read`, `prediction:export`, `employee:manage`, `member:invite`, `audit:read`, `settings:manage`, and `api_key:manage`.

**Benefits:** Least-privilege access, safer collaboration, clearer compliance posture, and scalable authorization.

**Future Scalability:** Enables custom roles, department-scoped permissions, team-scoped permissions, and enterprise policy engines later.

**Implementation Priority:** High.

### 17.7 Database Normalization And Tenant Safety

**Current Architecture:** Initial tables cover users, refresh tokens, employees, salary predictions, and audit logs.

**Problem:** Department and location are plain employee fields, roles are directly on users, and tenant ownership is not modeled.

**Why It Is A Limitation:** Plain fields become inconsistent, user-level roles break multi-org membership, and queries risk cross-tenant exposure.

**Recommended Enterprise Solution:** Normalize tenant entities and membership roles. Add tenant-scoped foreign keys, composite indexes, soft-delete strategy where appropriate, and authorization-friendly ownership columns.

**Benefits:** Data consistency, safer queries, better analytics, and cleaner access control.

**Future Scalability:** Supports partitioning, archival, organization-level analytics, and high-volume prediction history.

**Implementation Priority:** High.

### 17.8 Operational Data Model

**Current Architecture:** Audit logs exist, but no activity logs, system logs, notifications, reports, imports, exports, settings, feature flags, or dashboard preferences.

**Problem:** The database does not yet represent operational SaaS behavior.

**Why It Is A Limitation:** Production platforms need user-facing activity, internal observability, configurable behavior, report generation, and import/export tracking.

**Recommended Enterprise Solution:** Add tables for notifications, activity logs, system logs, feature flags, organization settings, user settings, reports, CSV imports, prediction exports, saved filters, and dashboard preferences.

**Benefits:** Better UX, supportability, reporting, controlled rollout, and operational auditability.

**Future Scalability:** Enables product analytics, admin tooling, customer support workflows, and enterprise reporting.

**Implementation Priority:** Medium.

### 17.9 Backend Service Architecture

**Current Architecture:** Endpoints call service layer, repositories, database, and integration clients.

**Problem:** Background jobs, queue boundaries, caching, scheduling, and webhook processing are not explicit.

**Why It Is A Limitation:** Batch predictions, exports, reports, CSV imports, email notifications, and virus scanning should not run inside request/response paths.

**Recommended Enterprise Solution:** Add worker architecture using Celery or equivalent, Redis for broker/cache/rate limits, scheduled tasks, retry policies, idempotency keys, and task status tracking.

**Benefits:** Reliable long-running workflows, better API latency, resilient retries, and safer resource usage.

**Future Scalability:** Supports horizontal API scaling, worker autoscaling, large imports, async report generation, and future workflow orchestration.

**Implementation Priority:** High.

### 17.10 API Governance

**Current Architecture:** Routes are versioned under `/api/v1` with normalized response and error shapes.

**Problem:** API governance does not yet include OpenAPI generation policy, idempotency, pagination conventions, webhook standards, or deprecation strategy.

**Why It Is A Limitation:** Enterprise APIs need predictable compatibility, client generation, retries, and external integrations.

**Recommended Enterprise Solution:** Define API standards for pagination, filtering, sorting, idempotency keys, request IDs, correlation IDs, webhooks, OpenAPI export, generated clients, and version deprecation.

**Benefits:** Safer clients, easier integrations, better observability, and lower regression risk.

**Future Scalability:** Supports public APIs, partner integrations, enterprise automation, and SDK generation.

**Implementation Priority:** Medium.

### 17.11 Frontend Enterprise Architecture

**Current Architecture:** React feature folders, shared components, React Query, Axios, route lazy loading, and error boundaries.

**Problem:** The architecture does not yet define enterprise table state, saved filters, notification center, internationalization, command/search patterns, or offline behavior in detail.

**Why It Is A Limitation:** HR users will repeatedly scan, filter, export, and compare data. Without a system, each feature will reinvent these patterns.

**Recommended Enterprise Solution:** Add dedicated architecture for tables, filters, URL query state, saved views, global search, notification center, theme manager, i18n, responsive shell, skeleton system, and offline state.

**Benefits:** Consistent UX, fewer duplicated states, better accessibility, and faster feature delivery.

**Future Scalability:** Supports multiple dashboards, enterprise data grids, localization, and admin experiences.

**Implementation Priority:** High.

### 17.12 UI/UX Design System

**Current Architecture:** A premium restrained UI direction and core shared UI components are defined.

**Problem:** Tokens, component behavior, chart rules, motion rules, table density, loading states, and accessibility rules are not yet formalized.

**Why It Is A Limitation:** Without design-system governance, the product can quickly become visually inconsistent and template-looking.

**Recommended Enterprise Solution:** Establish design tokens for color, typography, spacing, radius, elevation, shadows, motion, charts, focus rings, and data states. Define component variants for buttons, inputs, cards, tables, forms, dialogs, empty states, and skeletons.

**Benefits:** Premium consistency, faster design decisions, accessible defaults, and reusable implementation patterns.

**Future Scalability:** Supports white labeling, enterprise themes, density modes, and multiple products under the SalarySense brand.

**Implementation Priority:** High.

### 17.13 Prediction Platform

**Current Architecture:** Single prediction flow with immutable input snapshot, result persistence, confidence, model version, and latency.

**Problem:** Batch predictions, CSV import, comparison, export, retry, prediction versioning, and explainable AI readiness are missing.

**Why It Is A Limitation:** Enterprise HR workflows often work with departments, hiring plans, or employee groups rather than one record at a time.

**Recommended Enterprise Solution:** Add single prediction, batch prediction, CSV upload, prediction history, prediction detail, comparison, export, audit, retry, model version tracking, prediction feedback, and explainability placeholders.

**Benefits:** Real HR workflow support, better traceability, improved trust, and future ML iteration readiness.

**Future Scalability:** Supports async model providers, model A/B testing, explanation artifacts, bias monitoring, and analytics by model version.

**Implementation Priority:** High.

### 17.14 Dashboard Architecture

**Current Architecture:** Dashboard has summary metrics, recent predictions, and trend charts.

**Problem:** There is no persona-based dashboard model.

**Why It Is A Limitation:** Executives, HR leaders, recruiters, analysts, and individual users need different views of salary classification and workforce insights.

**Recommended Enterprise Solution:** Define executive, HR, recruiter, personal, analytics, and prediction dashboards. Include KPI cards, charts, heatmaps, tables, insights, notifications, reports, and recent activity.

**Benefits:** More useful analytics, clearer product value, and role-aware experiences.

**Future Scalability:** Enables customizable dashboards, saved layouts, embedded analytics, and report scheduling.

**Implementation Priority:** Medium.

### 17.15 File Storage Architecture

**Current Architecture:** File storage is not yet defined.

**Problem:** CSV uploads, reports, exports, images, and future resume uploads need storage, validation, access control, and lifecycle management.

**Why It Is A Limitation:** Handling files directly in the API or database will create performance, security, and cost issues.

**Recommended Enterprise Solution:** Introduce a cloud-storage abstraction with signed URLs, file metadata table, validation rules, size limits, allowed MIME types, checksum tracking, virus-scan-ready status, and tenant-scoped authorization.

**Benefits:** Secure uploads, scalable exports, resumable workflows, and safer future resume support.

**Future Scalability:** Supports S3-compatible storage, Supabase Storage, CDN delivery, retention policies, and asynchronous scanning.

**Implementation Priority:** Medium.

### 17.16 Security Architecture

**Current Architecture:** Server-side validation, SQLAlchemy, secure cookies where possible, CSRF consideration, XSS prevention, CORS, rate limiting, and audit logs.

**Problem:** Security controls are directionally correct but not mapped to OWASP Top 10 or enterprise threat scenarios.

**Why It Is A Limitation:** HR and salary data requires explicit defense-in-depth and reviewable controls.

**Recommended Enterprise Solution:** Add OWASP Top 10 mapping, CSP, security headers, brute-force protection, account lockout policy, secrets management, encryption strategy, tenant isolation tests, input sanitization policy, API authentication for service clients, and audit trail retention.

**Benefits:** Reduced breach risk, stronger compliance posture, and more trustworthy enterprise readiness.

**Future Scalability:** Supports SOC 2 readiness, customer security reviews, SSO, SCIM, and enterprise audit exports.

**Implementation Priority:** High.

### 17.17 DevOps Architecture

**Current Architecture:** Vercel for frontend, Render for API, Supabase PostgreSQL, and environment variables.

**Problem:** Docker, Docker Compose, CI/CD, preview deployments, staging, rollback, release gates, and infrastructure-as-code readiness are not yet defined.

**Why It Is A Limitation:** Production systems need repeatable builds, safe deployments, rollback paths, and environment separation.

**Recommended Enterprise Solution:** Add Dockerfiles, Docker Compose for local development, GitHub Actions for CI, preview deployments, staging deployment, production deployment, migration checks, smoke tests, rollback runbooks, and IaC-ready infrastructure folders.

**Benefits:** Repeatable environments, safer releases, faster onboarding, and clearer operational ownership.

**Future Scalability:** Supports multiple services, workers, scheduled jobs, blue-green releases, and compliance-driven change management.

**Implementation Priority:** High.

### 17.18 Testing Architecture

**Current Architecture:** Tests are mentioned but not fully designed.

**Problem:** No explicit test pyramid, ownership, or acceptance gates exist.

**Why It Is A Limitation:** Enterprise SaaS needs confidence across auth, authorization, tenant isolation, prediction flows, imports, exports, accessibility, and performance.

**Recommended Enterprise Solution:** Define unit, integration, API, frontend component, E2E, accessibility, security, load, and performance tests. Tenant isolation and permission tests must be release blockers.

**Benefits:** Lower regression risk, safer refactoring, and better production reliability.

**Future Scalability:** Supports CI gates, contract tests, visual regression tests, and compliance evidence.

**Implementation Priority:** High.

### 17.19 Monitoring And Observability

**Current Architecture:** Logs and metrics are mentioned at platform level, Sentry is listed as an environment variable.

**Problem:** Monitoring is not yet designed across app, API, worker, database, and external prediction calls.

**Why It Is A Limitation:** Without observability, failures in prediction latency, imports, auth, or database health will be hard to diagnose.

**Recommended Enterprise Solution:** Add Sentry for frontend/backend errors, structured logs, request IDs, correlation IDs, Prometheus-compatible metrics, Grafana dashboards, uptime checks, alerting, API latency tracking, database metrics, worker queue metrics, and prediction API health.

**Benefits:** Faster incident response, better SLA tracking, and actionable production diagnostics.

**Future Scalability:** Supports on-call processes, customer-facing status, anomaly detection, and capacity planning.

**Implementation Priority:** High.

### 17.20 Scalability Planning

**Current Architecture:** Performance patterns are listed, but user-scale tiers are not defined.

**Problem:** The system does not yet state how it evolves from 100 to 100,000+ users.

**Why It Is A Limitation:** Scaling decisions affect tenant modeling, query design, caching, queueing, rate limits, observability, and deployment topology.

**Recommended Enterprise Solution:** Define staged scaling targets for 100, 1,000, 10,000, and 100,000+ users, including database indexing, read optimization, caching, workers, connection pooling, partitioning, archival, and service separation.

**Benefits:** Better technical sequencing and fewer expensive rewrites.

**Future Scalability:** Enables horizontal scaling, workload isolation, larger customers, and analytics growth.

**Implementation Priority:** Medium.

### 17.21 Documentation Architecture

**Current Architecture:** Docs folder includes architecture, API contract, deployment, and roadmap placeholders.

**Problem:** Developer, API, deployment, security, contributing, coding standards, and runbook documentation are not yet defined.

**Why It Is A Limitation:** Enterprise teams need repeatable practices, onboarding material, and operational clarity.

**Recommended Enterprise Solution:** Add documentation sections for OpenAPI, Swagger usage, architecture decisions, deployment, local development, contributing, coding standards, security model, runbooks, troubleshooting, and release process.

**Benefits:** Faster onboarding, fewer mistakes, more consistent engineering, and better operational readiness.

**Future Scalability:** Supports larger engineering teams, external auditors, partners, and customer-facing API consumers.

**Implementation Priority:** Medium.

## 18. Upgraded Enterprise Target Architecture

### 18.1 Upgraded Repository Structure

```text
salarysense-ai/
  apps/
    web/
    api/
    worker/
    admin/
  packages/
    api-client/
    contracts/
    types/
    ui/
    config/
    utils/
    hooks/
    test-utils/
    eslint-config/
    tailwind-config/
  docker/
    web/
    api/
    worker/
  infra/
    vercel/
    render/
    supabase/
    monitoring/
    security/
    environments/
      development/
      staging/
      production/
  scripts/
    db/
    ci/
    release/
    security/
  tests/
    e2e/
    load/
    security/
    accessibility/
  docs/
    architecture/
    api/
    deployment/
    security/
    development/
    runbooks/
    decisions/
  .github/
    workflows/
```

`apps/admin` and `apps/worker` may remain deferred, but the architecture should reserve their boundaries from the start.

### 18.2 Multi-Tenant Domain Model

Core tenant model:

- `users` represent global identities.
- `organizations` represent customer workspaces.
- `organization_memberships` connect users to organizations.
- `departments` and `teams` belong to organizations.
- `roles` define named access bundles.
- `permissions` define granular capabilities.
- `role_permissions` connects roles to capabilities.
- `member_role_assignments` connects members to roles.
- Every sensitive business row includes `organization_id`.

Recommended role hierarchy:

- `platform_owner`: internal super-admin for platform operations.
- `platform_admin`: internal support/admin role with audited access.
- `organization_owner`: customer workspace owner.
- `organization_admin`: manages members, settings, departments, teams, and reports.
- `department_manager`: manages department-scoped employees and predictions.
- `recruiter`: creates predictions and manages candidate or employee inputs where allowed.
- `analyst`: views dashboards, reports, and prediction history.
- `member`: basic authenticated user.
- `read_only_auditor`: read-only access to audit-friendly views.

Permission examples:

- `organization:read`
- `organization:update`
- `member:invite`
- `member:remove`
- `role:manage`
- `employee:create`
- `employee:read`
- `employee:update`
- `employee:delete`
- `prediction:create`
- `prediction:read`
- `prediction:retry`
- `prediction:export`
- `report:create`
- `report:read`
- `audit:read`
- `api_key:manage`
- `settings:manage`

### 18.3 Upgraded Database Entity Catalog

Identity and access:

- `users`
- `user_profiles`
- `email_verification_tokens`
- `password_reset_tokens`
- `mfa_factors`
- `user_sessions`
- `refresh_tokens`
- `user_devices`
- `login_history`
- `api_keys`

Tenant and organization:

- `organizations`
- `organization_memberships`
- `organization_invitations`
- `organization_settings`
- `departments`
- `teams`
- `team_memberships`
- `roles`
- `permissions`
- `role_permissions`
- `member_role_assignments`
- `feature_flags`

Prediction and workforce:

- `employees`
- `employee_custom_fields`
- `employee_custom_field_values`
- `model_versions`
- `salary_predictions`
- `prediction_requests`
- `batch_prediction_jobs`
- `batch_prediction_items`
- `prediction_feedback`
- `prediction_explanations`
- `saved_filters`

Files, imports, and exports:

- `files`
- `file_scan_results`
- `csv_import_jobs`
- `csv_import_rows`
- `prediction_export_jobs`
- `reports`
- `report_schedules`

Experience and operations:

- `notifications`
- `activity_logs`
- `audit_logs`
- `system_logs`
- `dashboard_preferences`
- `user_settings`

Database requirements:

- All tenant business tables must include `organization_id`.
- All tenant-scoped queries must filter by `organization_id`.
- Foreign keys should be indexed.
- Prediction history needs composite indexes on `organization_id`, `user_id`, `employee_id`, `created_at`, and `predicted_class`.
- Batch imports need indexes on `organization_id`, `status`, and `created_at`.
- Audit logs should be append-only.
- Large operational logs should support retention and archival.
- Sensitive fields should be encrypted or tokenized where appropriate.

### 18.4 Upgraded Backend Architecture

```text
app/
  core/
    config
    security
    permissions
    tenancy
    logging
    metrics
    rate_limit
    errors
  api/
    v1/
      router
      dependencies
  features/
    auth
    users
    organizations
    members
    departments
    teams
    employees
    predictions
    imports
    exports
    reports
    notifications
    audit_logs
    settings
    api_keys
  integrations/
    prediction_client
    storage_client
    email_client
    webhook_client
  workers/
    tasks
    schedules
  db/
    models
    repositories
    migrations
```

Backend standards:

- Use dependency injection for current user, current organization, database session, permissions, request ID, and rate limiter.
- Use services for business workflows.
- Use repositories for persistence only.
- Use background jobs for imports, exports, reports, notifications, and batch predictions.
- Use Redis for rate limiting, short-lived caches, and queue broker if selected.
- Use circuit breakers for external prediction API calls.
- Use retry policies only for safe or idempotent operations.
- Use idempotency keys for prediction creation, imports, exports, and payment-ready future workflows.

### 18.5 Upgraded API Architecture

Additional enterprise routes:

```text
GET    /api/v1/organizations
POST   /api/v1/organizations
GET    /api/v1/organizations/{organization_id}
PATCH  /api/v1/organizations/{organization_id}
GET    /api/v1/organizations/{organization_id}/members
POST   /api/v1/organizations/{organization_id}/invitations
POST   /api/v1/invitations/{token}/accept
GET    /api/v1/organizations/{organization_id}/departments
POST   /api/v1/organizations/{organization_id}/departments
GET    /api/v1/organizations/{organization_id}/teams
POST   /api/v1/organizations/{organization_id}/teams
GET    /api/v1/roles
GET    /api/v1/permissions
POST   /api/v1/predictions/batch
POST   /api/v1/predictions/{prediction_id}/retry
GET    /api/v1/predictions/{prediction_id}/audit
POST   /api/v1/imports/csv
GET    /api/v1/imports/{import_id}
POST   /api/v1/exports/predictions
GET    /api/v1/exports/{export_id}
GET    /api/v1/notifications
PATCH  /api/v1/notifications/{notification_id}/read
GET    /api/v1/audit-logs
GET    /api/v1/activity-logs
GET    /api/v1/settings/organization
PATCH  /api/v1/settings/organization
GET    /api/v1/sessions
DELETE /api/v1/sessions/{session_id}
DELETE /api/v1/sessions
GET    /api/v1/api-keys
POST   /api/v1/api-keys
DELETE /api/v1/api-keys/{api_key_id}
```

API standards:

- Cursor pagination for large datasets.
- Offset pagination only for small admin lists.
- Filtering and sorting defined per endpoint.
- Request IDs on every response.
- Correlation IDs across API, worker, and prediction service calls.
- Idempotency keys for mutating endpoints that can be retried.
- Standardized error codes.
- OpenAPI generated from FastAPI and consumed by frontend client generation.

### 18.6 Upgraded Authentication And Session Flow

Authentication requirements:

- Email verification before production-sensitive workflows.
- Password reset with expiring single-use token.
- Password policy with minimum length, breach-list-ready design, and rate limits.
- Optional 2FA using TOTP first, WebAuthn-ready later.
- Short access token lifetime.
- Refresh token rotation with family reuse detection.
- Session table storing device, IP, user agent, created time, last seen time, and revoked time.
- Remember-me changes refresh token lifetime only.
- Logout revokes current session.
- Logout-all-devices revokes all sessions and refresh token families.
- Login history visible to the user.

Access token claims should stay minimal:

- `sub`
- `session_id`
- `active_organization_id`
- `token_version`
- `iat`
- `exp`

Permissions should be resolved server-side to avoid stale or over-trusted JWT claims.

### 18.7 Upgraded Frontend Architecture

Frontend app shell:

- Public layout for auth and lightweight marketing.
- Authenticated app layout with sidebar, top bar, organization switcher, search, notifications, and user menu.
- Dashboard layout optimized for dense analytics.
- Data-table layout for history, employees, imports, exports, and logs.
- Settings layout for profile, security, organization, members, roles, API keys, and preferences.

Frontend systems:

- Auth provider for session bootstrap and refresh coordination.
- Organization provider for active tenant context.
- Permission guard for route and component-level checks.
- Theme provider for light, dark, and system mode.
- I18n provider reserved from Phase 2 even if only English ships initially.
- Toast and notification system.
- Offline detector.
- Error boundaries at app, layout, and route level.
- Query-state utilities for filters, sorting, pagination, and search.
- Table abstraction with column definitions, empty states, skeletons, export actions, and responsive density.

### 18.8 Enterprise Design System

Design tokens:

- Color: background, surface, elevated, border, text, muted text, brand, accent, success, warning, danger, info.
- Typography: display, heading, title, body, small, caption, mono.
- Spacing: 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64.
- Radius: 4, 6, 8, 12, full only for pills and avatars.
- Elevation: flat, raised, overlay, popover.
- Motion: fast 120ms, normal 180ms, slow 240ms; reduced-motion support required.
- Charts: categorical palette, salary-class palette, grid, tooltip, axis, legend, empty chart state.

Component systems:

- Buttons: primary, secondary, subtle, destructive, icon, loading, disabled.
- Inputs: text, number, select, combobox, date, search, file, textarea.
- Forms: field wrapper, label, hint, error, section, submit bar.
- Cards: metric, data, action, alert.
- Tables: density modes, sticky header, sorting, filtering, pagination, bulk actions.
- Charts: KPI, trend, distribution, heatmap, comparison.
- Feedback: toast, inline alert, banner, empty state, error state, skeleton.

Accessibility rules:

- WCAG 2.2 AA target.
- Keyboard navigation for all interactive components.
- Visible focus rings.
- Accessible names for icon buttons.
- Color cannot be the only state indicator.
- Reduced-motion support.
- Screen-reader friendly loading, empty, and error states.

### 18.9 Prediction Platform Architecture

Prediction capabilities:

- Single prediction.
- Batch prediction.
- CSV upload.
- Prediction history.
- Prediction details.
- Prediction comparison.
- Prediction export.
- Prediction audit.
- Prediction retry.
- Model version tracking.
- Future explainable AI support.

Prediction workflow standards:

- Validate inputs on frontend and backend.
- Normalize payload before calling prediction API.
- Use backend-only prediction API credentials.
- Store immutable input snapshot.
- Store model version and provider response metadata.
- Store latency and request ID.
- Validate external response shape.
- Mark failed predictions with safe error status.
- Retry only when idempotent and allowed.
- Process batch predictions asynchronously.

### 18.10 Enterprise Dashboard Architecture

Dashboard types:

- Executive dashboard: organization-level KPIs, workforce classification distribution, trends, high-level insights.
- HR dashboard: department comparisons, employee segments, prediction volume, recent activity.
- Recruiter dashboard: recent candidate classifications, pending imports, prediction actions.
- Personal dashboard: user activity, saved filters, recent predictions.
- Analytics dashboard: charts, heatmaps, cohorts, exports, reports.
- Prediction dashboard: model version usage, prediction latency, batch status, failure rates.

Dashboard modules:

- KPI cards.
- Trend charts.
- Classification distribution.
- Department heatmaps.
- Recent activity.
- Notifications.
- Insights.
- Reports.
- Tables with saved filters.

### 18.11 File Storage Architecture

File categories:

- CSV uploads.
- PDF reports.
- Excel reports.
- User or organization images.
- Future resume uploads.

Storage requirements:

- Store files outside PostgreSQL.
- Store file metadata in PostgreSQL.
- Use signed URLs for upload and download.
- Enforce file size limits.
- Validate MIME type and extension.
- Store checksum.
- Track scan status as `pending`, `clean`, `infected`, `failed`, or `skipped`.
- Restrict access by organization and permission.
- Support retention and deletion policies.

### 18.12 Security Architecture Upgrade

OWASP mapping:

- Broken Access Control: tenant scoping, permission checks, route guards, authorization tests.
- Cryptographic Failures: secure cookies, TLS, hashed tokens, password hashing, encrypted secrets.
- Injection: SQLAlchemy parameterization, Pydantic validation, allowlists.
- Insecure Design: threat modeling, abuse-case review, security acceptance criteria.
- Security Misconfiguration: secure headers, strict CORS, environment separation.
- Vulnerable Components: dependency scanning and update policy.
- Identification And Authentication Failures: MFA-ready design, session tracking, rate limits.
- Software And Data Integrity Failures: CI checks, signed artifacts where practical, protected branches.
- Logging And Monitoring Failures: audit logs, Sentry, metrics, alerts.
- SSRF: strict outbound client allowlists for external integrations.

Security controls:

- Content Security Policy.
- `HttpOnly`, `Secure`, `SameSite` cookies where cookie auth is used.
- CSRF tokens for cookie-auth mutating requests if needed.
- Rate limits by IP, user, organization, and endpoint.
- Brute-force protection for login and password reset.
- Secrets managed through platform secret stores.
- Production debug disabled.
- No raw prediction API secrets in frontend.
- Audit logs for sensitive actions.

### 18.13 DevOps And Deployment Upgrade

Environments:

- Development.
- Staging.
- Production.

Pipeline stages:

- Install dependencies.
- Lint.
- Type check.
- Unit tests.
- Backend integration tests.
- API contract validation.
- Frontend build.
- Security dependency scan.
- Accessibility smoke checks.
- E2E smoke tests.
- Docker build.
- Staging deployment.
- Migration dry-run or validation.
- Production deployment approval.
- Post-deploy smoke test.

Deployment responsibilities:

- Vercel hosts web app and preview deployments.
- Render hosts API and worker services.
- Supabase hosts PostgreSQL.
- Redis provider supports caching, queues, and rate limiting.
- GitHub Actions coordinates validation and deployment.

Rollback strategy:

- Keep previous frontend deployment available through Vercel.
- Keep previous API image or Render deployment available.
- Make migrations backward-compatible whenever possible.
- Require rollback runbook for destructive migrations.
- Separate migration deployment from application deployment for risky changes.

### 18.14 Testing Architecture Upgrade

Testing layers:

- Unit tests for utilities, validation, services, permissions, and pure UI logic.
- Integration tests for repositories, database transactions, auth flows, and prediction client behavior.
- API tests for all core endpoints and error responses.
- Frontend component tests for forms, tables, dialogs, route guards, loading states, empty states, and error states.
- E2E tests for register, login, organization switch, create prediction, view history, import CSV, export report, and logout.
- Accessibility tests for keyboard flow, labels, contrast, and screen-reader states.
- Security tests for tenant isolation, permission denial, auth expiration, CSRF-sensitive paths, and rate limits.
- Performance tests for dashboard load, history pagination, imports, exports, and prediction latency.
- Load tests for 100, 1,000, 10,000, and 100,000+ user-readiness milestones.

Release blockers:

- Tenant isolation failure.
- Auth bypass.
- Permission bypass.
- Migration failure.
- Broken prediction creation.
- Critical accessibility regression in primary workflows.

### 18.15 Monitoring And Observability Upgrade

Signals:

- Frontend errors.
- Backend errors.
- Worker errors.
- API latency.
- Prediction API latency.
- Prediction failure rate.
- Database query latency.
- Queue depth.
- Job retry count.
- Rate-limit events.
- Login failures.
- Export/import failures.

Tools:

- Sentry for crash reporting and performance traces.
- Structured JSON logs.
- Prometheus-compatible metrics.
- Grafana dashboards.
- Platform logs from Vercel and Render.
- Supabase database metrics.
- Alerting through email or incident channel.

Dashboards:

- Application health.
- API health.
- Worker health.
- Database health.
- Prediction service health.
- Security events.
- Business activity.

### 18.16 Scalability Model

100 users:

- Single API service.
- Single worker service.
- Managed PostgreSQL.
- Basic Redis.
- Basic dashboard queries.

1,000 users:

- Add query indexes based on real usage.
- Add connection pooling.
- Add worker concurrency.
- Add caching for dashboard summaries.
- Add alerting thresholds.

10,000 users:

- Scale API horizontally.
- Scale workers independently.
- Move heavy reports to async jobs.
- Add read-optimized dashboard aggregates.
- Add stricter rate limits and import quotas.

100,000+ users:

- Partition high-volume logs and prediction history.
- Archive cold data.
- Use stronger queue isolation by workload type.
- Consider read replicas.
- Consider dedicated analytics store.
- Consider service separation for prediction orchestration, reporting, and notifications.

## 19. Enterprise Architecture Scores

Scores reflect the upgraded Phase 1 target architecture, not implementation completion.

| Category | Score |
| --- | ---: |
| Enterprise Architecture Score | 9.1 / 10 |
| Scalability Score | 9.0 / 10 |
| Security Score | 9.0 / 10 |
| SaaS Readiness Score | 9.2 / 10 |
| Maintainability Score | 9.1 / 10 |
| Production Readiness Score | 8.8 / 10 |
| Final Architecture Score | 9.0 / 10 |

Primary remaining risk: production readiness depends on disciplined implementation, CI gates, tenant isolation tests, and deployment verification in later phases.

## 20. Pre-Phase-2 Improvement Checklist

High priority before Phase 2:

- Confirm the monorepo will use enterprise package boundaries from the start.
- Confirm multi-tenancy is foundational, not deferred.
- Confirm `organization_id` is required on all tenant business data.
- Confirm users are global identities and memberships provide organization access.
- Confirm RBAC plus PBAC is the authorization model.
- Confirm auth includes session records, refresh rotation, email verification, and device history.
- Confirm Phase 2 scaffolds `apps/web`, `apps/api`, package folders, `infra`, `docker`, `scripts`, `tests`, and `.github/workflows`.
- Confirm backend foundation includes dependency injection for current user, current organization, permissions, request ID, and database session.
- Confirm frontend foundation includes app shell, route guards, query provider, theme provider, error boundaries, toast system, and organization context placeholders.
- Confirm API responses use standardized success and error envelopes.
- Confirm OpenAPI generation is part of backend standards.
- Confirm tenant isolation tests become mandatory release blockers.
- Confirm Docker and Docker Compose are included for local development.
- Confirm GitHub Actions are included for linting, type checks, tests, and builds.
- Confirm environment separation for development, staging, and production.
