import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { App } from '../../App';
import type { Todo } from './api';

const todo = (title: string, completed = false): Todo => ({
  id: crypto.randomUUID(),
  title,
  completed,
  createdAt: '2026-10-30T10:00:00.000Z',
  updatedAt: '2026-10-30T10:00:00.000Z',
});

// A fetch stub that serves the list and records every call.
function mockApi(todos: Todo[]) {
  const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
    const json = (status: number, body?: unknown) => new Response(body === undefined ? null : JSON.stringify(body), { status });
    if (!init?.method || init.method === 'GET') return json(200, { data: todos, meta: { page: 1, limit: 100, total: todos.length } });
    if (init.method === 'POST') return json(201, { data: todo(JSON.parse(String(init.body)).title) });
    if (init.method === 'PATCH') return json(200, { data: { ...todos[0], ...JSON.parse(String(init.body)) } });
    return json(204);
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function renderApp() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>,
  );
}

it('shows the todos', async () => {
  mockApi([todo('Buy milk'), todo('Call the bank', true)]);
  renderApp();
  expect(await screen.findByLabelText('Buy milk')).not.toBeChecked();
  expect(screen.getByLabelText('Call the bank')).toBeChecked();
});

it('shows a message when there are no todos', async () => {
  mockApi([]);
  renderApp();
  expect(await screen.findByText(/No todos yet/)).toBeInTheDocument();
});

it('adds a todo', async () => {
  const fetchMock = mockApi([]);
  renderApp();
  await userEvent.type(await screen.findByLabelText('New todo'), 'Write the report');
  await userEvent.click(screen.getByRole('button', { name: 'Add' }));
  expect(fetchMock).toHaveBeenCalledWith('/api/v1/todos', expect.objectContaining({ method: 'POST', body: JSON.stringify({ title: 'Write the report' }) }));
});

it('does not send an empty todo', async () => {
  const fetchMock = mockApi([]);
  renderApp();
  await userEvent.click(await screen.findByRole('button', { name: 'Add' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Write something first.');
  expect(fetchMock).toHaveBeenCalledTimes(1); // only the list
});

it('ticks a todo', async () => {
  const fetchMock = mockApi([todo('Buy milk')]);
  renderApp();
  await userEvent.click(await screen.findByLabelText('Buy milk'));
  expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/\/api\/v1\/todos\/.+/), expect.objectContaining({ method: 'PATCH', body: JSON.stringify({ completed: true }) }));
});
