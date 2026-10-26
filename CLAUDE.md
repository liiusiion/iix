# Liili backend

NestJS API for Liili, a cabin and room booking app. Postgres via Drizzle ORM (`1.0.0-rc`), auth via Better Auth, request/response validation via Zod (`nestjs-zod`).

## Commands

- `npm run develop` starts the DB container (waits until healthy) and the app in watch mode
- `npm run db:generate` creates a migration from schema changes, `npm run db:migrate` applies pending migrations
- `npm run auth:generate` writes the schema Better Auth expects to `.better-auth/auth-schema.ts` (reference only, see below)
- `npm run lint`, `npm run format`, `npx tsc --noEmit`
- `npm run add:service --name=<name>` (also `add:repository`, `add:controller`, `add:client`, `add:decorator:common`) scaffolds files in the right place

Do not use `npm run db:push`: drizzle-kit doesn't know about the custom SQL constraints (see Database) and would try to drop them.

## Routes

Everything is under `/api`: app routes (`/api/properties`), docs at `/api/reference` (Scalar) and `/api/swagger` (Swagger UI, JSON at `/api/swagger/json`), Better Auth at `/api/auth/*` with its docs at `/api/auth/reference`.

## Structure

- `src/entrypoints/api/<feature>/` controllers, with Zod DTOs in `dto/request/*.schema.ts` and `dto/response/*.schema.ts`
- `src/modules/services/<name>/` business logic, `src/modules/repositories/<name>/` DB access, `src/modules/integrations/<name>/` external API clients
- `src/common/` shared decorators, filters, helpers, pipes, types and infrastructure modules (e.g. `modules/drizzle`)
- `src/configs/*.config.ts` env variables parsed with Zod at startup
- `src/db/schema/tables/*.table.ts` Drizzle tables, `src/db/migrations/` generated migrations
- `src/auth.ts` Better Auth config as a `createAuth()` factory, built through Nest DI in `app.module.ts`

Controllers call services, services call repositories, and only repositories touch the DB (inject it with `@InjectDb()`).

## Conventions

- **Types** of a service, repository or module go in a `types/` folder next to it, named `<name>-<kind>.types.ts`, e.g. `modules/services/email/types/email-service.types.ts`. Don't declare them inside the service or module file.
- **Comments** only for things that aren't obvious from the code (why a workaround exists, hidden behavior, a rule enforced elsewhere). No comments that restate the code.
- **DTOs** are Zod schemas: export the schema, its inferred type and a `createZodDto` class.
- **Formatting** is Prettier (single quotes, trailing commas, width 100, LF line endings).

## Database

- Every table is defined with `mainSchema.table(...)` from `src/db/schema/pg-schemas.ts`. It puts tables in the `main` Postgres schema and maps camelCase properties to snake_case columns. Don't use `pgTable`.
- Tables spread `commonFields` (uuid `id`, `createdAt`, `updatedAt`).
- Constraints Drizzle can't express go in custom migrations (`npx drizzle-kit generate --custom --name=<name>`), with a comment on the table pointing to them. Currently: `bookings_no_overlap`, an exclusion constraint preventing overlapping active bookings per property.

## Auth

- Every route requires a session by default (global guard from `@thallesp/nestjs-better-auth`). Mark public routes with `@AllowAnonymous()` and restrict by role with `@Roles([Role.Admin])`.
- Better Auth serves its own routes under `/api/auth/*`, documented at `/api/auth/reference`.
- The auth tables (`users`, `sessions`, `accounts`, `verifications`) are hand-written Drizzle tables, not the CLI output. When adding a Better Auth plugin or `additionalFields`, run `npm run auth:generate`, compare `.better-auth/auth-schema.ts` with `src/db/schema`, and add what's missing to the tables. Never edit or import the generated file.
- Better Auth's `name` field is mapped to `users.first_name`. `role` can't be set by clients (`input: false`).
