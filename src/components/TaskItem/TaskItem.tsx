import Checkbox from '../Checkbox/Checkbox';
import EditButton from '../EditButton/EditButton';
import RemoveButton from '../RemoveButton/RemoveButton';

import styles from './TaskItem.module.scss';

function TaskItem() {
  return (
    <li className={styles.task}>
      <Checkbox label="Task 1" />

      <div className={styles.control}>
        <EditButton />
        <RemoveButton />
      </div>
    </li>
  );
}

export default TaskItem;
