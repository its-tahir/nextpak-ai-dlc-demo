import { ErrorBoundary } from './components/ErrorBoundary';
import { AddTodoForm } from './features/todos/AddTodoForm';
import { TodoList } from './features/todos/TodoList';

export function App() {
  return (
    <main className="app">
      <h1>Todos</h1>
      <ErrorBoundary>
        <AddTodoForm />
        <TodoList />
      </ErrorBoundary>
    </main>
  );
}
