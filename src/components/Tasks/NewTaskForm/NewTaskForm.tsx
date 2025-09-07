import { useState, type FormEvent, type JSX } from 'react';
import Button from '@components/ui/Button/Button';
import styles from './NewTaskForm.module.scss';
import { isTaskTextValid } from '@utils/validators';
import { ERROR_TASK_TEXT_LENGTH } from '@utils/errors';
import { createTask } from '@api/tasks';
import { handleError } from '@utils/helpers';
import TextInput from '@components/ui/TextInput/TextInput';

interface Props {
  refetchTasks: () => Promise<void>;
}

function NewTaskForm({ refetchTasks }: Props): JSX.Element {
  const [taskText, setTaskText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  async function createNewTask(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    if (!isTaskTextValid(taskText)) {
      setError(ERROR_TASK_TEXT_LENGTH);
      return;
    }

    setError('');

    try {
      setIsLoading(true);
      await createTask(taskText);
      await refetchTasks();
      setTaskText('');
      setError('');
    } catch (err) {
      handleError(err, setError);
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
        onChange={e => setTaskText(e.target.value)}
        errorText={error}
      />

      <Button size="medium" disabled={isLoading}>
        Add
      </Button>
    </form>
  );
}

export default NewTaskForm;
