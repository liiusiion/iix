# iix backend

NestJS 12 API for iix (working name), a cabin and room booking app. Postgres via Drizzle ORM (`1.0.0-rc`), auth via Better Auth, request/response validation with Zod schemas through Nest's native Standard Schema support. ESM project on Node 24.

## Commands

- `npm run develop` starts the DB container (waits until healthy) and the app in watch mode
- `npm run build`, then `npm run start:prod` runs `dist/main.js` (needs the env, e.g. `node --env-file=.env dist/main.js`)
- `npm run db:generate` creates a migration from schema changes, `npm run db:migrate` applies pending migrations
- `npm run auth:generate` writes the schema Better Auth expects to `.better-auth/auth-schema.ts` (reference only, see below)
- `npm run lint` (oxlint in type-aware mode, with `--fix`), `npm run format`, `npx tsc --noEmit`
- `npm test` runs unit tests (`src/**/*.spec.ts`), `npm run test:e2e` runs `test/**/*.e2e-spec.ts` against the DB from `.env` (Vitest)
- `npm run add:service --name=<name>` (also `add:repository`, `add:controller`, `add:client`, `add:decorator:common`) scaffolds files in the right place

Do not use `npm run db:push`: drizzle-kit doesn't know about the custom SQL constraints (see Database) and would try to drop them.

## Routes

Everything is under `/api`: app routes (`/api/properties`), docs at `/api/reference` (Scalar) and `/api/swagger` (Swagger UI, JSON at `/api/swagger/json`), Better Auth at `/api/auth/*` with its docs at `/api/auth/reference`.

The prefix, CORS, docs and request logger are set up in `main.ts`, so e2e tests that build the app from `AppModule` don't get them.

## Structure

- `src/entrypoints/api/<feature>/` controllers, with DTOs in `dto/request/*.schema.ts` and `dto/response/*.schema.ts`
- `src/modules/services/<name>/` business logic, `src/modules/repositories/<name>/` DB access, `src/modules/integrations/<name>/` external API clients
- `src/common/` shared decorators, filters, helpers, middlewares, pipes and infrastructure modules (e.g. `modules/drizzle`)
- `src/configs/*.config.ts` env variables parsed with Zod at startup
- `src/db/schema/tables/*.table.ts` Drizzle tables, `src/db/migrations/` generated migrations
- `src/auth.ts` Better Auth config as a `createAuth()` factory, built through Nest DI in `app.module.ts`

Controllers call services, services call repositories, and only repositories touch the DB (inject it with `@InjectDb()`).

## Conventions

- **Imports**: the project is ESM, so relative imports end in `.js` (`./app.module.js`, `./db/schema/index.js`).
- **Types** of a service, repository or module go in a `types/` folder next to it, named `<name>-<kind>.types.ts`, e.g. `modules/services/email/types/email-service.types.ts`. Don't declare them inside the service or module file.
- **Type-only imports**: a type used in a decorated signature (constructor injection, handler parameters) must be imported with `import type` or the inline `type` modifier, or the build fails (TS1272, `isolatedModules` + `emitDecoratorMetadata`).
- **Comments** only for things that aren't obvious from the code (why a workaround exists, hidden behavior, a rule enforced elsewhere). No comments that restate the code.
- **Formatting** is Prettier (single quotes, trailing commas, width 100, LF line endings). Control statements always use braces (oxlint `curly`).

## Validation and DTOs

- A DTO file exports a Zod schema and its inferred type with a `Dto` suffix: `CreatePropertySchema` and `type CreatePropertyDto = z.infer<typeof CreatePropertySchema>`. No DTO classes.
- Validate input by passing the schema to the parameter decorator: `@Body({ schema: CreatePropertySchema }) body: CreatePropertyDto`, same for `@Param` and `@Query`. Swagger picks the schema up from there.
- Declare responses with `@ApiSchemaResponse({ status, schema })`: it documents the response and the global serializer parses it with the schema, which strips unknown keys. For array responses pass the item schema, the serializer parses each element.
- Validation errors are 400 `{ statusCode, timestamp, message: 'Request validation failed.', errors: ["Field '<path>'. <message>"] }` (`SchemaValidationPipe` + `HttpExceptionFilter`).
- Add docs details with `.meta({ description, example })`.

## Database

- The dev DB runs in Docker as `iix_db` on host port 15432 (5433–5532 is reserved by Hyper-V on Windows, check with `netsh int ipv4 show excludedportrange protocol=tcp`).
- Every table is defined with `mainSchema.table(...)` from `src/db/schema/pg-schemas.ts`. It puts tables in the `main` Postgres schema and maps camelCase properties to snake_case columns. Don't use `pgTable`.
- Tables spread `commonFields` (uuid `id`, `createdAt`, `updatedAt`).
- Constraints Drizzle can't express go in custom migrations (`npx drizzle-kit generate --custom --name=<name>`), with a comment on the table pointing to them. Currently: `bookings_no_overlap`, an exclusion constraint preventing overlapping active bookings per property.

## Auth

- Every route requires a session by default (global guard from `@thallesp/nestjs-better-auth`). Mark public routes with `@AllowAnonymous()` and restrict by role with `@Roles([Role.Admin])`.
- Better Auth serves its own routes under `/api/auth/*`, documented at `/api/auth/reference`.
- The auth tables (`users`, `sessions`, `accounts`, `verifications`) are hand-written Drizzle tables, not the CLI output. When adding a Better Auth plugin or `additionalFields`, run `npm run auth:generate`, compare `.better-auth/auth-schema.ts` with `src/db/schema`, and add what's missing to the tables. Never edit or import the generated file.
- Better Auth's `name` field is mapped to `users.first_name`. `role` can't be set by clients (`input: false`).
- Keep `better-auth`, `@better-auth/drizzle-adapter` and the `auth` CLI on the same version.
