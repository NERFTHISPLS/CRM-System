import type { Task, TaskCreateRequest } from '../../types/task';
import { BASE_URL } from '../../utils/constants';

export async function updateTaskTitle(
  id: Task['id'],
  title: Task['title']
): Promise<Task> {
  const body: TaskCreateRequest = { title };

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
