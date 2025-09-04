import TaskItem from '../TaskItem/TaskItem';
import styles from './TasksList.module.scss';
import { useFetchTasks } from '../../hooks/useFetchTasks';

function TasksList() {
  const { tasks, error } = useFetchTasks();

  if (error === '') {
    <p>{error}</p>;
  }

  return (
    <ul className={styles.list}>
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}

export default TasksList;
