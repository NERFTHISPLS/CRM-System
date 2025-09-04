import TaskItem from '../TaskItem/TaskItem';
import styles from './TasksList.module.scss';

function TasksList() {
  return (
    <ul className={styles.list}>
      <TaskItem />
    </ul>
  );
}

export default TasksList;
