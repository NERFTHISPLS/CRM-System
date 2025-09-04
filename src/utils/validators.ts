import { MAX_TASK_TEXT_LENGTH, MIN_TASK_TEXT_LENGTH } from './constants';

export function validateTaskText(taskText: string): boolean {
  const taskTextLength = taskText.length;

  return (
    taskTextLength >= MIN_TASK_TEXT_LENGTH &&
    taskTextLength <= MAX_TASK_TEXT_LENGTH
  );
}
