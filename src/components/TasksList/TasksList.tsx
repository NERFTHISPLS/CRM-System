import TaskItem from '../TaskItem/TaskItem';
import styles from './TasksList.module.scss';
import Loader from '../Loader/Loader';
import type { Task } from '../../types/task';

interface Props {
  tasks: Task[];
  isLoading: boolean;
  error: string;
  onTaskToggle: (taskId: Task['id'], isDone: Task['isDone']) => void;
}

function TasksList({ tasks, isLoading, error, onTaskToggle }: Props) {
  if (isLoading) {
    return <Loader />;
  }

  if (error !== '') {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <ul className={styles.list}>
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} onTaskToggle={onTaskToggle} />
      ))}
    </ul>
  );
}

export default TasksList;
