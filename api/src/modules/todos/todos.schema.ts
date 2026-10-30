import { z } from 'zod';

export const TodoIdParams = z.object({ id: z.uuid() });

export const ListTodosQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const Title = z.string().trim().min(1).max(200);

export const CreateTodoBody = z.strictObject({ title: Title });

export const UpdateTodoBody = z
  .strictObject({ title: Title.optional(), completed: z.boolean().optional() })
  .refine((b) => b.title !== undefined || b.completed !== undefined, { message: 'Send title or completed' });

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};
export type ListTodosInput = z.infer<typeof ListTodosQuery>;
export type CreateTodoInput = z.infer<typeof CreateTodoBody>;
export type UpdateTodoInput = z.infer<typeof UpdateTodoBody>;
