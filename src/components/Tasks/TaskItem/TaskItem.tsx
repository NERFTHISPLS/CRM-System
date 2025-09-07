import { useState, type FormEvent, type JSX } from 'react';
import { removeTask, updateTask } from '@api/tasks';
import { combineClassNames, handleError } from '@utils/helpers';
import Checkbox from '@components/ui/Checkbox/Checkbox';
import styles from './TaskItem.module.scss';
import TextInput from '@components/ui/TextInput/TextInput';
import { isTaskTextValid } from '@utils/validators';
import { ERROR_TASK_TEXT_LENGTH } from '@utils/errors';
import type { Todo } from '@/types/task';
import Button from '@/components/ui/Button/Button';

interface Props {
  task: Todo;
  refetchTasks: () => Promise<void>;
}

const iconClassNames = combineClassNames(
  'material-symbols-outlined',
  styles.icon
);

function TaskItem({ task, refetchTasks }: Props): JSX.Element {
  const [taskTextEdit, setTaskTextEdit] = useState<string>('');
  const [isEditSession, setIsEditSession] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  function handleStartEditSession(): void {
    setIsEditSession(true);
    setTaskTextEdit(task.title);
  }

  async function handleTaskToggle(): Promise<void> {
    setError('');

    try {
      setIsLoading(true);
      await updateTask(task.id, { isDone: !task.isDone });
      await refetchTasks();
      setError('');
    } catch (err) {
      handleError(err, setError);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleEditTaskText(
    e: FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();

    if (taskTextEdit === task.title) {
      handleEditCancel();
      return;
    }

    setError('');

    try {
      if (!isTaskTextValid(taskTextEdit)) {
        throw new Error(ERROR_TASK_TEXT_LENGTH);
      }

      setIsLoading(true);
      await updateTask(task.id, { title: taskTextEdit });
      await refetchTasks();
      setError('');
    } catch (err) {
      handleError(err, setError);
    } finally {
      setIsLoading(false);
      setIsEditSession(false);
    }
  }

  function handleEditCancel(): void {
    setError('');
    setIsEditSession(false);
  }

  async function handleRemoveTask(): Promise<void> {
    setError('');

    try {
      setIsLoading(true);
      await removeTask(task.id);
      await refetchTasks();
      setError('');
    } catch (err) {
      handleError(err, setError);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <li className={styles.task}>
      {isEditSession ? (
        <form className={styles.editForm} onSubmit={handleEditTaskText}>
          <TextInput
            className={styles.editInput}
            value={taskTextEdit}
            onChange={e => setTaskTextEdit(e.target.value)}
          />

          <div className={styles.control}>
            <div className={styles.saveCancelButtons}>
              <Button type="submit" disabled={isLoading}>
                <span className={iconClassNames}>check</span>
              </Button>

              <Button
                type="reset"
                variant="neutral"
                disabled={isLoading}
                onClick={handleEditCancel}
              >
                <span className={iconClassNames}>close</span>
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <>
          <Checkbox
            label={task.title}
            checked={task.isDone}
            onChange={handleTaskToggle}
            errorMessage={error}
            disabled={isLoading}
          />

          <div className={styles.control}>
            <Button disabled={isLoading} onClick={handleStartEditSession}>
              <span className={iconClassNames}>edit_square</span>
            </Button>

            <Button
              variant="danger"
              disabled={isLoading}
              onClick={handleRemoveTask}
            >
              <span className={iconClassNames}>delete</span>
            </Button>
          </div>
        </>
      )}
    </li>
  );
}

export default TaskItem;
