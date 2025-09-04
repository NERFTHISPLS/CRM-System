import TaskItem from '../TaskItem/TaskItem';
import styles from './TasksList.module.scss';
import { useFetchTasks } from '../../hooks/useFetchTasks';
import Loader from '../Loader/Loader';

function TasksList() {
  const { tasks, isLoading, error } = useFetchTasks();

  if (isLoading) {
    return <Loader />;
  }

  if (error !== '') {
    return <p>{error}</p>;
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
