import type { Rule } from 'antd/es/form';

const MIN_TODO_TITLE_LENGTH = 2;
const MAX_TODO_TITLE_LENGTH = 64;

export const TODO_TITLE_INPUT_RULES: Rule[] = [
  { required: true, message: 'Please enter a task' },
  {
    pattern: /^(?!\s*$).+/, // no space chars
    message: 'Task title cannot consist of only spaces',
  },
  {
    min: MIN_TODO_TITLE_LENGTH,
    message: `Task must be at least ${MIN_TODO_TITLE_LENGTH} characters`,
  },
  {
    max: MAX_TODO_TITLE_LENGTH,
    message: `Task must be at least ${MAX_TODO_TITLE_LENGTH} characters`,
  },
];
