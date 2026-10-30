import { z } from 'zod';

export const TodoIdParams = z.object({ id: z.uuid() });

const CalendarDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a calendar date in YYYY-MM-DD format')
  .refine(
    (d) => !isNaN(Date.parse(`${d}T00:00:00.000Z`)) && new Date(`${d}T00:00:00.000Z`).toISOString().slice(0, 10) === d,
    { message: 'Invalid calendar date' }
  );

export const ListTodosQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  overdue: z.union([z.boolean(), z.enum(['true', 'false']).transform((v) => v === 'true')]).optional(),
});

const Title = z.string().trim().min(1).max(200);

export const CreateTodoBody = z.strictObject({
  title: Title,
  dueDate: CalendarDate.nullable().optional(),
});

export const UpdateTodoBody = z
  .strictObject({
    title: Title.optional(),
    completed: z.boolean().optional(),
    dueDate: CalendarDate.nullable().optional(),
  })
  .refine((b) => b.title !== undefined || b.completed !== undefined || b.dueDate !== undefined, {
    message: 'Send title, completed, or dueDate',
  });

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string | null;
  overdue: boolean;
  createdAt: string;
  updatedAt: string;
};

export function isTodoOverdue(todo: { completed: boolean; dueDate?: string | null }, todayUTC: string): boolean {
  return !todo.completed && Boolean(todo.dueDate && todo.dueDate < todayUTC);
}

export type ListTodosInput = z.infer<typeof ListTodosQuery>;
export type CreateTodoInput = z.infer<typeof CreateTodoBody>;
export type UpdateTodoInput = z.infer<typeof UpdateTodoBody>;
