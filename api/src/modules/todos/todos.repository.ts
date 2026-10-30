import { isTodoOverdue } from './todos.schema.js';

export type StoredTodo = {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
};

// In-memory store: the app has no database yet. Todos are lost on restart.
const todos = new Map<string, StoredTodo>();

export const todosRepository = {
  list(offset: number, limit: number, filter?: { overdue?: boolean }) {
    let all = [...todos.values()];
    if (filter?.overdue !== undefined) {
      const todayUTC = new Date().toISOString().slice(0, 10);
      all = all.filter((t) => {
        const overdue = isTodoOverdue(t, todayUTC);
        return filter.overdue ? overdue : !overdue;
      });
    }
    return { items: all.slice(offset, offset + limit), total: all.length };
  },
  findById(id: string) {
    return todos.get(id);
  },
  save(todo: StoredTodo) {
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
