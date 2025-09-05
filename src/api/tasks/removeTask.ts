import type { Task } from '../../types/task';
import { BASE_URL } from '../../utils/constants';

export async function removeTask(id: Task['id']): Promise<void> {
  await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'DELETE',
  });
}
