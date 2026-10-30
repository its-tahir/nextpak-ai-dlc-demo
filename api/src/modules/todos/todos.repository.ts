import type { Todo } from './todos.schema.js';

// In-memory store: the app has no database yet. Todos are lost on restart.
const todos = new Map<string, Todo>();

export const todosRepository = {
  list(offset: number, limit: number) {
    const all = [...todos.values()];
    return { items: all.slice(offset, offset + limit), total: all.length };
  },
  findById(id: string) {
    return todos.get(id);
  },
  save(todo: Todo) {
    todos.set(todo.id, todo);
    return todo;
  },
  remove(id: string) {
    todos.delete(id);
  },
  clear() {
    todos.clear();
  },
};
