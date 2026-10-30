# Todos

Last updated: 2026-10-30 (c3204b2)

## What it does
Allows users to create, list, view, update, and delete todo items.
Todos track a task's title and completion status.

## Code
- `api/src/modules/todos/**` - Express backend endpoints, service, repository, and Zod schemas
- `web/src/features/todos/**` - React frontend components (TodoList, AddTodoForm) and TanStack Query hooks

## Key concepts
- **Todo**: An item to be done, with an `id`, `title`, boolean `completed` status, and timestamps (`createdAt`, `updatedAt`).

## How it works
1. **Creation**: User inputs title -> POST `/api/v1/todos` validated by `CreateTodoBody` -> service creates item with UUID -> saved in in-memory repository (returns 201 `{ data: Todo }`).
2. **Listing**: Client queries GET `/api/v1/todos?page=1&limit=20` -> returns `{ data: Todo[], meta: { page, limit, total } }`.
3. **Updating**: Client sends PATCH `/api/v1/todos/:id` with optional `title` and/or `completed` status (returns 200 `{ data: Todo }`).
4. **Deletion**: Client calls DELETE `/api/v1/todos/:id` -> repository deletes item (returns 204 No Content).

## Rules and edge cases
- Todo ID must be a valid UUID (`api/src/modules/todos/todos.schema.ts:TodoIdParams`).
- Title is trimmed, min 1 and max 200 characters (`api/src/modules/todos/todos.schema.ts:Title`).
- In-memory storage is volatile (state resets upon process restart).

## Data
- `Todo`:
  - `id`: string (UUID)
  - `title`: string (1..200 chars)
  - `completed`: boolean
  - `createdAt`: ISO 8601 string
  - `updatedAt`: ISO 8601 string

## API / events
- `GET /api/v1/todos` - List todos with pagination (`?page=1&limit=20`), returns `{ data, meta }`
- `POST /api/v1/todos` - Create a new todo (`{ title }`), returns 201 `{ data }`
- `GET /api/v1/todos/:id` - Fetch single todo by UUID, returns `{ data }`
- `PATCH /api/v1/todos/:id` - Update title or status (`{ title?, completed? }`), returns `{ data }`
- `DELETE /api/v1/todos/:id` - Remove todo by UUID, returns 204

## Known issues / gotchas
- Bug: In `api/src/modules/todos/todos.service.ts` (`update`), `completed: input.completed || todo.completed` prevents un-ticking / un-completing a todo. Setting `completed: false` evaluates to `false || true` (which stays `true`). A card will follow to fix this.
