import { toggleTask as toggleTaskApi } from '../../api/tasks/toggleTask';
import type { Task } from '../../types/task';
import Checkbox from '../Checkbox/Checkbox';
import EditButton from '../EditButton/EditButton';
import RemoveButton from '../RemoveButton/RemoveButton';

import styles from './TaskItem.module.scss';

interface Props {
  task: Task;
  onTaskToggle: (taskId: Task['id'], isDone: Task['isDone']) => void;
}

function TaskItem({ task, onTaskToggle }: Props) {
  async function handleTaskToggle(checked: boolean) {
    await toggleTaskApi(task);
    onTaskToggle(task.id, checked);
  }

  return (
    <li className={styles.task}>
      <Checkbox
        label={task.title}
        checked={task.isDone}
        onChange={handleTaskToggle}
      />

      <div className={styles.control}>
        <EditButton />
        <RemoveButton />
      </div>
    </li>
  );
}

export default TaskItem;
