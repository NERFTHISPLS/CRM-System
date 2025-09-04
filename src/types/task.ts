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
