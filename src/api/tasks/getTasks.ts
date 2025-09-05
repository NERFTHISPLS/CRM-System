import type { MetaResponse } from '../../types/general';
import type { Task, TaskStatusCount } from '../../types/task';
import { BASE_URL } from '../../utils/constants';

export async function getTasks(): Promise<MetaResponse<Task, TaskStatusCount>> {
  const res = await fetch(`${BASE_URL}/todos`);
  const data = (await res.json()) as MetaResponse<Task, TaskStatusCount>;

  return data;
}
