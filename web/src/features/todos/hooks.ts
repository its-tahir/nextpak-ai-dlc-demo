import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { todosApi, type Todo } from './api';

const KEY = ['todos'];

export function useTodos(params?: { overdue?: boolean }) {
  return useQuery({
    queryKey: [...KEY, params?.overdue ? 'overdue' : 'all'],
    queryFn: () => todosApi.list(params),
  });
}

function useTodoMutation<V>(fn: (vars: V) => Promise<unknown>) {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: fn, onSettled: () => queryClient.invalidateQueries({ queryKey: KEY }) });
}

export const useCreateTodo = () =>
  useTodoMutation((input: { title: string; dueDate?: string | null } | string) => {
    const payload = typeof input === 'string' ? { title: input } : input;
    return todosApi.create(payload);
  });

export const useUpdateTodo = () =>
  useTodoMutation(({ id, ...patch }: { id: string } & Partial<Pick<Todo, 'title' | 'completed' | 'dueDate'>>) =>
    todosApi.update(id, patch)
  );

export const useDeleteTodo = () => useTodoMutation((id: string) => todosApi.remove(id));
