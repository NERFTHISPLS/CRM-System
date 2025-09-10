import { MAX_TASK_TEXT_LENGTH, MIN_TASK_TEXT_LENGTH } from './constants';

export const ERROR_EMPTY_TASK_TEXT = 'Please enter a task';
export const ERROR_TASK_TEXT_TOO_SHORT = `Task must be at least ${MIN_TASK_TEXT_LENGTH} characters`;
export const ERROR_TASK_TEXT_TOO_LONG = `Task must be at least ${MAX_TASK_TEXT_LENGTH} characters`;
