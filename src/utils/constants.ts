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
    message: `Task can't be longer than ${MAX_TODO_TITLE_LENGTH} characters`,
  },
];

const MAX_USERNAME_LENGTH = 60;

export const USERNAME_INPUT_RULES: Rule[] = [
  { required: true, message: 'Please input your username' },
  {
    max: MAX_USERNAME_LENGTH,
    message: `Username can't be longer than ${MAX_USERNAME_LENGTH} characters`,
  },
  {
    pattern: /^[a-zA-Zа-яА-ЯёЁ]+$/,
    message: 'Username can only contain Russian and English letters',
  },
];
export const EMAIL_INPUT_RULES: Rule[] = [
  { required: true, message: 'Please input your email' },
  {
    type: 'email',
    message: 'Please enter a valid email address',
  },
];
export const PHONE_NUMBER_INPUT_RULES: Rule[] = [
  {
    // https://uibakery.io/regex-library/phone-number
    pattern: /^\+?[1-9][0-9]{7,14}$/,
    message: 'Please enter a valid phone number',
  },
];
