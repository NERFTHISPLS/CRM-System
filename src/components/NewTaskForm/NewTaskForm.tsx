import { useState, type FormEvent } from 'react';
import Button from '../Button/Button';

import styles from './NewTaskForm.module.scss';
import { validateTaskText } from '../../utils/validators';
import { ERROR_TASK_TEXT_LENGTH } from '../../utils/errors';
import { createTask as createTaskApi } from '../../api/tasks/createTask';
import type { Task } from '../../types/task';
import { formatError } from '../../utils/helpers';
import TextInput from '../TextInput/TextInput';

interface Props {
  onTaskCreation: (newTask: Task) => void;
}

function NewTaskForm({ onTaskCreation }: Props) {
  const [taskText, setTaskText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function createNewTask(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    if (!validateTaskText(taskText)) {
      setError(ERROR_TASK_TEXT_LENGTH);
      return;
    }

    setIsLoading(false);
    setError('');

    try {
      setIsLoading(true);
      const createdTask = await createTaskApi(taskText);
      onTaskCreation(createdTask);
      setTaskText('');
      setError('');
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        setError(formatError(err.message));
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={createNewTask}>
      <TextInput
        value={taskText}
        placeholder="Task to be done..."
        disabled={isLoading}
        onChange={setTaskText}
        errorText={error}
      />

      <Button size="medium" disabled={isLoading}>
        Add
      </Button>
    </form>
  );
}

export default NewTaskForm;
