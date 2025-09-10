import type { MetaResponse } from '@/types/general';
import type {
  Todo,
  TodoFilterValue,
  TodoInfo,
  TodoRequest,
} from '@/types/task';
import axios from 'axios';

const apiClient = axios.create({ baseURL: 'https://easydev.club/api/v1' });

export async function getTasks(
  taskFilterValue: TodoFilterValue = 'all'
): Promise<MetaResponse<Todo, TodoInfo>> {
  const res = await apiClient.get<MetaResponse<Todo, TodoInfo>>('/todos', {
    params: { filter: taskFilterValue },
  });

  return res.data;
}

export async function createTask(taskText: string): Promise<Todo> {
  const res = await apiClient.post<Todo>('/todos', {
    title: taskText,
  });

  return res.data;
}

export async function updateTask(
  id: Todo['id'],
  fieldsToUpdate: TodoRequest
): Promise<Todo> {
  const res = await apiClient.put<Todo>(`/todos/${id}`, fieldsToUpdate);

  return res.data;
}

export async function removeTask(id: Todo['id']): Promise<void> {
  await apiClient.delete(`todos/${id}`);
}
