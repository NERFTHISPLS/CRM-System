import TaskItem from '../TaskItem/TaskItem';
import styles from './TasksList.module.scss';
import Loader from '../Loader/Loader';
import type { Task } from '../../types/task';

interface Props {
  tasks: Task[];
  isLoading: boolean;
  error: string;
}

function TasksList({ tasks, isLoading, error }: Props) {
  if (isLoading) {
    return <Loader />;
  }

  if (error !== '') {
    return <p className={styles.error}>{error}</p>;
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
