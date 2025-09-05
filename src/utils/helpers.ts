import type { Task, TaskFilterValue, TaskStatusCount } from '../types/task';

export function combineClassNames(...classNames: string[]): string {
  return classNames.join(' ');
}

export function formatError(errorMessage: string): string {
  return `Something went wrong: ${errorMessage}`;
}

export function handleError(
  err: unknown,
  handler: (errText: string) => void
): void | never {
  console.error(err);

  if (err instanceof Error) {
    handler(formatError(err.message));
    return;
  }

  throw err;
}

export function filterTasks(
  tasks: Task[],
  filterValue: TaskFilterValue
): Task[] {
  switch (filterValue) {
    case 'inWork':
      return tasks.filter(task => !task.isDone);
    case 'completed':
      return tasks.filter(task => task.isDone);
    default:
      return tasks;
  }
}

export function calcCountInfo(tasks: Task[]): TaskStatusCount {
  const all = tasks.length;
  const inWork = tasks.filter(task => !task.isDone).length;
  const completed = all - inWork;

  return { all, inWork, completed };
}
