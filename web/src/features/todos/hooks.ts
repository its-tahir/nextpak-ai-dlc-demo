import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { todosApi, type Todo } from './api';

const KEY = ['todos'];

export function useTodos() {
  return useQuery({ queryKey: KEY, queryFn: todosApi.list });
}

function useTodoMutation<V>(fn: (vars: V) => Promise<unknown>) {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: fn, onSettled: () => queryClient.invalidateQueries({ queryKey: KEY }) });
}

export const useCreateTodo = () => useTodoMutation((title: string) => todosApi.create(title));
export const useUpdateTodo = () =>
  useTodoMutation(({ id, ...patch }: { id: string } & Partial<Pick<Todo, 'title' | 'completed'>>) => todosApi.update(id, patch));
export const useDeleteTodo = () => useTodoMutation((id: string) => todosApi.remove(id));
