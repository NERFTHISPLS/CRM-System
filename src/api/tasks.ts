import type { MetaResponse } from '@/types/general';
import type {
  Todo,
  TodoFilterValue,
  TodoInfo,
  TodoRequest,
} from '@/types/task';
import { BASE_URL } from '@/utils/constants';

export async function getTasks(
  taskFilterValue: TodoFilterValue = 'all'
): Promise<MetaResponse<Todo, TodoInfo>> {
  const res = await fetch(`${BASE_URL}/todos?filter=${taskFilterValue}`);
  const data: MetaResponse<Todo, TodoInfo> = await res.json();

  return data;
}

export async function createTask(taskText: string): Promise<Todo> {
  const res = await fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: taskText,
    }),
  });
  const data: Todo = await res.json();

  return data;
}

export async function updateTask(
  id: Todo['id'],
  fieldsToUpdate: TodoRequest
): Promise<Todo> {
  const res = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fieldsToUpdate),
  });
  const data: Todo = await res.json();

  return data;
}

export async function removeTask(id: Todo['id']): Promise<void> {
  await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'DELETE',
  });
}
