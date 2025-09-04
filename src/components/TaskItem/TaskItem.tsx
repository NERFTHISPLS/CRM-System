import styles from './TaskItem.module.scss';

function TaskItem() {
  return (
    <li className={styles.task}>
      <div className={styles.info}>
        <input type="checkbox" />
        <p>Task 1</p>
      </div>

      <div className={styles.control}>
        <button>Edit</button>
        <button>Remove</button>
      </div>
    </li>
  );
}

export default TaskItem;
