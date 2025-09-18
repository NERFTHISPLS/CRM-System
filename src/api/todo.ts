import type {
  GetTodoResponse,
  Todo,
  TodoFilterValue,
  TodoRequest,
} from '@/types/todo';
import { apiClient } from './apiClient';

export async function getTodos(
  todoFilterValue: TodoFilterValue = 'all'
): Promise<GetTodoResponse> {
  const res = await apiClient.get<GetTodoResponse>('/todos', {
    params: { filter: todoFilterValue },
  });

  return res.data;
}

export async function createTodo(todoTitle: string): Promise<Todo> {
  const res = await apiClient.post<Todo>('/todos', {
    title: todoTitle,
  });

  return res.data;
}

export async function updateTodo(
  id: Todo['id'],
  fieldsToUpdate: TodoRequest
): Promise<Todo> {
  const res = await apiClient.put<Todo>(`/todos/${id}`, fieldsToUpdate);

  return res.data;
}

export async function removeTodo(id: Todo['id']): Promise<void> {
  await apiClient.delete(`/todos/${id}`);
}
