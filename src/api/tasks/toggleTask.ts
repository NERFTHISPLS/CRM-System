import type { Task, TaskCreateRequest } from '../../types/task';
import { BASE_URL } from '../../utils/constants';

export async function toggleTask({ id, isDone }: Task): Promise<Task> {
  const body: TaskCreateRequest = {
    isDone: !isDone,
  };

  const res = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as Task;

  return data;
}
