import { useState, type FormEvent } from 'react';
import { useCreateTodo } from './hooks';

export function AddTodoForm() {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const create = useCreateTodo();

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Write something first.');
      return;
    }
    setError('');
    create.mutate(title.trim(), { onSuccess: () => setTitle('') });
  }

  return (
    <form onSubmit={submit} className="add-form">
      <label htmlFor="new-todo">New todo</label>
      <input
        id="new-todo"
        value={title}
        maxLength={200}
        onChange={(e) => setTitle(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'new-todo-error' : undefined}
      />
      <button type="submit" disabled={create.isPending}>
        Add
      </button>
      {(error || create.error) && (
        <p id="new-todo-error" role="alert" className="error">
          {error || create.error?.message}
        </p>
      )}
    </form>
  );
}
