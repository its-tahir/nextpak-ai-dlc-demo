import { useState, type FormEvent } from 'react';
import { useCreateTodo } from './hooks';

export function AddTodoForm() {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const create = useCreateTodo();

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Write something first.');
      return;
    }
    setError('');
    const payload = dueDate ? { title: title.trim(), dueDate } : { title: title.trim() };
    create.mutate(payload, {
      onSuccess: () => {
        setTitle('');
        setDueDate('');
      },
    });
  }

  return (
    <form onSubmit={submit} className="add-form">
      <div className="form-field title-field">
        <label htmlFor="new-todo">New todo</label>
        <input
          id="new-todo"
          value={title}
          maxLength={200}
          onChange={(e) => setTitle(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'new-todo-error' : undefined}
        />
      </div>
      <div className="form-field">
        <label htmlFor="new-todo-due-date">Due date</label>
        <input
          id="new-todo-due-date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
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
