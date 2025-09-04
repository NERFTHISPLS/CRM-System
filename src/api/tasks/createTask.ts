import type { Task, TaskCreateRequest } from '../../types/task';
import { BASE_URL } from '../../utils/constants';

export async function createTask(taskText: string): Promise<Task> {
  const body: TaskCreateRequest = {
    title: taskText,
    isDone: false,
  };

  const res = await fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as Task;

  return data;
}
