import Checkbox from '../Checkbox/Checkbox';
import styles from './TaskItem.module.scss';

function TaskItem() {
  return (
    <li className={styles.task}>
      <Checkbox label="Task 1" />

      <div className={styles.control}>
        <button>Edit</button>
        <button>Remove</button>
      </div>
    </li>
  );
}

export default TaskItem;
