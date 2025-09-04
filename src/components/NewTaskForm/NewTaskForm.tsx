import { useState, type FormEvent } from 'react';
import Button from '../Button/Button';

import styles from './NewTaskForm.module.scss';
import { validateTaskText } from '../../utils/validators';
import { ERROR_TASK_TEXT_LENGTH } from '../../utils/errors';
import { createTask as createTaskApi } from '../../api/tasks/createTask';
import type { Task } from '../../types/task';
import { formatError } from '../../utils/helpers';

interface Props {
  onTaskCreation: (newTask: Task) => void;
}

function NewTaskForm({ onTaskCreation }: Props) {
  const [taskText, setTaskText] = useState('');
  const [error, setError] = useState('');

  async function createNewTask(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    if (!validateTaskText(taskText)) {
      setError(ERROR_TASK_TEXT_LENGTH);
      return;
    }

    setError('');

    try {
      const createdTask = await createTaskApi(taskText);
      onTaskCreation(createdTask);
      setTaskText('');
      setError('');
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        setError(formatError(err.message));
      }
    }
  }

  return (
    <form className={styles.form} onSubmit={createNewTask}>
      <div className={styles.inputWrapper}>
        <input
          className={styles.input}
          type="text"
          placeholder="Task to be done..."
          value={taskText}
          onChange={e => setTaskText(e.target.value)}
        />

        {error !== '' && <p className={styles.error}>{error}</p>}
      </div>

      <Button size="medium">Add</Button>
    </form>
  );
}

export default NewTaskForm;
