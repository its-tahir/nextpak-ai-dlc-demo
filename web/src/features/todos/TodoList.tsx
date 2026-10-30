import { useState } from 'react';
import { useDeleteTodo, useTodos, useUpdateTodo } from './hooks';

export function TodoList() {
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);
  const { data: todos, isPending, isError, error } = useTodos({ overdue: showOverdueOnly });
  const update = useUpdateTodo();
  const remove = useDeleteTodo();

  return (
    <div className="todos-container">
      <div className="filters">
        <label>
          <input
            type="checkbox"
            checked={showOverdueOnly}
            onChange={(e) => setShowOverdueOnly(e.target.checked)}
          />
          Show overdue only
        </label>
      </div>

      {isPending && <p>Loading todos...</p>}
      {isError && <p role="alert">Could not load todos: {error.message}</p>}
      {!isPending && !isError && !todos?.length && (
        <p>{showOverdueOnly ? 'No overdue todos.' : 'No todos yet. Add your first one above.'}</p>
      )}

      {todos && todos.length > 0 && (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className={todo.completed ? 'done' : undefined}>
              <label>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => update.mutate({ id: todo.id, completed: !todo.completed })}
                />
                <span>{todo.title}</span>
              </label>
              {todo.dueDate && <span className="due-date">Due {todo.dueDate}</span>}
              {todo.overdue && <span className="badge overdue">Overdue</span>}
              <button onClick={() => remove.mutate(todo.id)} aria-label={`Delete "${todo.title}"`}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
