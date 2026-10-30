import { useDeleteTodo, useTodos, useUpdateTodo } from './hooks';

export function TodoList() {
  const { data: todos, isPending, isError, error } = useTodos();
  const update = useUpdateTodo();
  const remove = useDeleteTodo();

  if (isPending) return <p>Loading todos...</p>;
  if (isError) return <p role="alert">Could not load todos: {error.message}</p>;
  if (!todos.length) return <p>No todos yet. Add your first one above.</p>;

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <li key={todo.id} className={todo.completed ? 'done' : undefined}>
          <label>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => update.mutate({ id: todo.id, completed: !todo.completed })}
            />
            {todo.title}
          </label>
          <button onClick={() => remove.mutate(todo.id)} aria-label={`Delete "${todo.title}"`}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
