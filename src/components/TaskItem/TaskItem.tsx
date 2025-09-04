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
  const [error, setError] = useState('');

  async function handleTaskToggle(checked: boolean) {
    setError('');

    try {
      await toggleTaskApi(task);
      onTaskToggle(task.id, checked);
      setError('');
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        setError(formatError(err.message));
      }
    }
  }

  return (
    <li className={styles.task}>
      <Checkbox
        label={task.title}
        checked={task.isDone}
        onChange={handleTaskToggle}
        errorMessage={error}
      />

      <div className={styles.control}>
        <EditButton />
        <RemoveButton />
      </div>
    </li>
  );
}

export default TaskItem;
