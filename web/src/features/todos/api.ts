export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/v1${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...init?.headers } });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message ?? `Request failed (${res.status})`);
  }
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}

export const todosApi = {
  list: () => request<{ data: Todo[] }>('/todos?limit=100').then((r) => r.data),
  create: (title: string) =>
    request<{ data: Todo }>('/todos', { method: 'POST', body: JSON.stringify({ title }) }).then((r) => r.data),
  update: (id: string, patch: Partial<Pick<Todo, 'title' | 'completed'>>) =>
    request<{ data: Todo }>(`/todos/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }).then((r) => r.data),
  remove: (id: string) => request<void>(`/todos/${id}`, { method: 'DELETE' }),
};
