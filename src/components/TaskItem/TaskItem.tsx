import { useState } from 'react';
import { toggleTask as toggleTaskApi } from '../../api/tasks/toggleTask';
import type { Task } from '../../types/task';
import { formatError } from '../../utils/helpers';
import Checkbox from '../Checkbox/Checkbox';
import EditButton from '../EditButton/EditButton';
import RemoveButton from '../RemoveButton/RemoveButton';

import styles from './TaskItem.module.scss';

interface Props {
  task: Task;
  onTaskToggle: (taskId: Task['id'], isDone: Task['isDone']) => void;
}

function TaskItem({ task, onTaskToggle }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleTaskToggle(checked: boolean) {
    setError('');
    setIsLoading(false);

    try {
      setIsLoading(true);
      await toggleTaskApi(task);
      onTaskToggle(task.id, checked);
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
    <li className={styles.task}>
      <Checkbox
        label={task.title}
        checked={task.isDone}
        onChange={handleTaskToggle}
        errorMessage={error}
        disabled={isLoading}
      />

      <div className={styles.control}>
        <EditButton disabled={isLoading} />
        <RemoveButton disabled={isLoading} />
      </div>
    </li>
  );
}

export default TaskItem;
