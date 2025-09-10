import type { MetaResponse } from './general';

export interface Todo {
  id: number;
  title: string;
  created: string; // ISO date string
  isDone: boolean;
}

export type GetTodoResponse = MetaResponse<Todo, TodoInfo>;

export type TodoInfo = Record<TodoFilterValue, number>;

export type TodoRequest = Partial<Omit<Todo, 'id' | 'created'>>;

export interface TodoFilter {
  label: string;
  value: TodoFilterValue;
}

export type TodoFilterValue = 'all' | 'completed' | 'inWork';
