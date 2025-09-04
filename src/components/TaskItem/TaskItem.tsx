import type { Task } from '../../types/task';
import Checkbox from '../Checkbox/Checkbox';
import EditButton from '../EditButton/EditButton';
import RemoveButton from '../RemoveButton/RemoveButton';

import styles from './TaskItem.module.scss';

interface Props {
  task: Task;
}

function TaskItem({ task }: Props) {
  return (
    <li className={styles.task}>
      <Checkbox label={task.title} />

      <div className={styles.control}>
        <EditButton />
        <RemoveButton />
      </div>
    </li>
  );
}

export default TaskItem;
