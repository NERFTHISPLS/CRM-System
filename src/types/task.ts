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

export type GetTasksResponse = TaskMetaResponse<Task, TaskStatusCount>;

interface TaskStatusCount {
  all?: number;
  completed?: number;
  inWork?: number;
}

interface TaskMetaResponse<T, N> {
  data: T[];
  info?: N;
  meta: {
    totalAmount: number;
  };
}
