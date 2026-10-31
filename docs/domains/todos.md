# Todos

Last updated: 2026-10-31

## What it does
Allows users to create, list, view, update, and delete todo items.
Todos track a task's title, completion status, optional due date, and overdue indicator.

## Code
- `api/src/modules/todos/**` - Express backend endpoints, service, repository, and Zod schemas
- `web/src/features/todos/**` - React frontend components (TodoList, AddTodoForm) and TanStack Query hooks

## Key concepts
- **Todo**: An item to be done, with an `id`, `title`, boolean `completed` status, optional `dueDate` (calendar date, YYYY-MM-DD), boolean `overdue` indicator, and timestamps (`createdAt`, `updatedAt`).

## How it works
1. **Creation**: User inputs title and optional due date -> POST `/api/v1/todos` validated by `CreateTodoBody` -> service creates item with UUID -> saved in in-memory repository (returns 201 `{ data: Todo }`).
2. **Listing**: Client queries GET `/api/v1/todos?page=1&limit=20&overdue=true` -> returns `{ data: Todo[], meta: { page, limit, total } }`.
3. **Updating**: Client sends PATCH `/api/v1/todos/:id` with optional `title`, `completed`, and/or `dueDate` (returns 200 `{ data: Todo }`).
4. **Deletion**: Client calls DELETE `/api/v1/todos/:id` -> repository deletes item (returns 204 No Content).

## Rules and edge cases
- Todo ID must be a valid UUID (`api/src/modules/todos/todos.schema.ts:TodoIdParams`).
- Title is trimmed, min 1 and max 200 characters (`api/src/modules/todos/todos.schema.ts:Title`).
- Due date is an optional calendar date in YYYY-MM-DD format (no time); setting `dueDate: null` removes it.
- Overdue status is evaluated by the server: true when incomplete (`completed: false`) and `dueDate` is strictly before today (server date in UTC).
- In-memory storage is volatile (state resets upon process restart).

## Data
- `Todo`:
  - `id`: string (UUID)
  - `title`: string (1..200 chars)
  - `completed`: boolean
  - `dueDate`: string | null (YYYY-MM-DD)
  - `overdue`: boolean
  - `createdAt`: ISO 8601 string
  - `updatedAt`: ISO 8601 string

## API / events
- `GET /api/v1/todos` - List todos with pagination (`?page=1&limit=20`) and optional overdue filter (`?overdue=true`), returns `{ data, meta }`
- `POST /api/v1/todos` - Create a new todo (`{ title, dueDate? }`), returns 201 `{ data }`
- `GET /api/v1/todos/:id` - Fetch single todo by UUID, returns `{ data }`
- `PATCH /api/v1/todos/:id` - Update title, status, or due date (`{ title?, completed?, dueDate? }`), returns `{ data }`
- `DELETE /api/v1/todos/:id` - Remove todo by UUID, returns 204

## Known issues / gotchas
- None currently.
