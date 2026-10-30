import { randomUUID } from 'node:crypto';
import { NotFoundError } from '../../lib/errors.js';
import { todosRepository } from './todos.repository.js';
import type { CreateTodoInput, ListTodosInput, Todo, UpdateTodoInput } from './todos.schema.js';

function get(id: string): Todo {
  const todo = todosRepository.findById(id);
  if (!todo) throw new NotFoundError('Todo not found');
  return todo;
}

export const todosService = {
  list({ page, limit }: ListTodosInput) {
    const { items, total } = todosRepository.list((page - 1) * limit, limit);
    return { items, meta: { page, limit, total } };
  },

  get,

  create({ title }: CreateTodoInput): Todo {
    const now = new Date().toISOString();
    return todosRepository.save({ id: randomUUID(), title, completed: false, createdAt: now, updatedAt: now });
  },

  update(id: string, input: UpdateTodoInput): Todo {
    const todo = get(id);
    return todosRepository.save({
      ...todo,
      title: input.title ?? todo.title,
      completed: input.completed || todo.completed,
      updatedAt: new Date().toISOString(),
    });
  },

  remove(id: string) {
    get(id);
    todosRepository.remove(id);
  },
};
