import type { MetaResponse } from '../../types/general';
import type { Task, TaskFilterValue, TaskStatusCount } from '../../types/task';
import { BASE_URL } from '../../utils/constants';

export async function getTasks(
  taskFilterValue: TaskFilterValue = 'all'
): Promise<MetaResponse<Task, TaskStatusCount>> {
  const res = await fetch(`${BASE_URL}/todos?filter=${taskFilterValue}`);
  const data = (await res.json()) as MetaResponse<Task, TaskStatusCount>;

  return data;
}
