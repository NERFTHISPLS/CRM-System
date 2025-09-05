import type { TaskFilter } from '../types/task';

export const BASE_URL = 'https://easydev.club/api/v1';

export const MIN_TASK_TEXT_LENGTH = 2;
export const MAX_TASK_TEXT_LENGTH = 64;

export const TASK_FILTERS: TaskFilter[] = [
  { label: 'All', value: 'all' },
  { label: 'In work', value: 'inWork' },
  { label: 'Completed', value: 'completed' },
];
