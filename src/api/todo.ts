import type { MetaResponse } from '@/types/general';
import type {
  Todo,
  TodoFilterValue,
  TodoInfo,
  TodoRequest,
} from '@/types/todo';
import axios from 'axios';

const apiClient = axios.create({ baseURL: 'https://easydev.club/api/v1' });

export async function getTodos(
  todoFilterValue: TodoFilterValue = 'all'
): Promise<MetaResponse<Todo, TodoInfo>> {
  const res = await apiClient.get<MetaResponse<Todo, TodoInfo>>('/todos', {
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
  await apiClient.delete(`todos/${id}`);
}
