import { tempTasks } from '../../data/tempTasks';
import TaskItem from '../TaskItem/TaskItem';
import styles from './TasksList.module.scss';

function TasksList() {
  return (
    <ul className={styles.list}>
      {tempTasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}

export default TasksList;
