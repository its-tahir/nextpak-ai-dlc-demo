import { randomUUID } from 'node:crypto';
import { NotFoundError } from '../../lib/errors.js';
import { todosRepository, type StoredTodo } from './todos.repository.js';
import { isTodoOverdue, type CreateTodoInput, type ListTodosInput, type Todo, type UpdateTodoInput } from './todos.schema.js';

function toTodo(stored: StoredTodo, todayUTC?: string): Todo {
  const today = todayUTC ?? new Date().toISOString().slice(0, 10);
  return {
    ...stored,
    dueDate: stored.dueDate ?? null,
    overdue: isTodoOverdue(stored, today),
  };
}

function getStored(id: string): StoredTodo {
  const todo = todosRepository.findById(id);
  if (!todo) throw new NotFoundError('Todo not found');
  return todo;
}

export const todosService = {
  list({ page, limit, overdue }: ListTodosInput) {
    const todayUTC = new Date().toISOString().slice(0, 10);
    const { items, total } = todosRepository.list((page - 1) * limit, limit, { overdue, todayUTC });
    return { items: items.map((t) => toTodo(t, todayUTC)), meta: { page, limit, total } };
  },

  get(id: string): Todo {
    return toTodo(getStored(id));
  },

  create({ title, dueDate }: CreateTodoInput): Todo {
    const now = new Date().toISOString();
    const saved = todosRepository.save({
      id: randomUUID(),
      title,
      completed: false,
      dueDate: dueDate ?? null,
      createdAt: now,
      updatedAt: now,
    });
    return toTodo(saved);
  },

  update(id: string, input: UpdateTodoInput): Todo {
    const todo = getStored(id);
    const saved = todosRepository.save({
      ...todo,
      title: input.title ?? todo.title,
      completed: input.completed || todo.completed,
      dueDate: input.dueDate !== undefined ? input.dueDate : (todo.dueDate ?? null),
      updatedAt: new Date().toISOString(),
    });
    return toTodo(saved);
  },

  remove(id: string) {
    getStored(id);
    todosRepository.remove(id);
  },
};
