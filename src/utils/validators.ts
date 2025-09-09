const MIN_TASK_TEXT_LENGTH = 2;
const MAX_TASK_TEXT_LENGTH = 64;

const ERROR_TASK_TEXT_LENGTH = `Task text length must be of length between ${MIN_TASK_TEXT_LENGTH} and ${MAX_TASK_TEXT_LENGTH}`;

export function validateTaskText(taskText: string): never | void {
  if (!isTaskTextValid(taskText)) {
    throw new Error(ERROR_TASK_TEXT_LENGTH);
  }
}

function isTaskTextValid(taskText: string): boolean {
  const taskTextLength = taskText.trim().length;

  return (
    taskTextLength >= MIN_TASK_TEXT_LENGTH &&
    taskTextLength <= MAX_TASK_TEXT_LENGTH
  );
}
