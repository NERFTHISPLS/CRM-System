import type { MetaResponse } from './general';

export interface Task {
  id: number;
  title: string;
  created: string; // ISO date string
  isDone: boolean;
}

export interface TaskRequest {
  title: string;
  isDone: boolean;
}

export type GetTasksResponse = MetaResponse<Task, TaskStatusCount>;

export interface TaskStatusCount {
  all?: number;
  completed?: number;
  inWork?: number;
}

export type TaskCreateRequest = Partial<Omit<Task, 'id' | 'created'>>;
