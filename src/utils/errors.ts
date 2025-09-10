import { MAX_TODO_TITLE_LENGTH, MIN_TODO_TITLE_LENGTH } from './constants';

export const ERROR_EMPTY_TODO_TEXT = 'Please enter a task';
export const ERROR_TODO_TEXT_TOO_SHORT = `Task must be at least ${MIN_TODO_TITLE_LENGTH} characters`;
export const ERROR_TODO_TEXT_TOO_LONG = `Task must be at least ${MAX_TODO_TITLE_LENGTH} characters`;
export const ERROR_TODO_TEXT_ONLY_SPACES =
  'Task title cannot consist of only spaces';
