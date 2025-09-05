import TaskItem from '../TaskItem/TaskItem';
import styles from './TasksList.module.scss';
import type { Task } from '../../types/task';

interface Props {
  tasks: Task[];
  error: string;
  refetchTasks: () => Promise<void>;
}

function TasksList({ tasks, error, refetchTasks }: Props) {
  if (error !== '') {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <ul className={styles.list}>
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} refetchTasks={refetchTasks} />
      ))}
    </ul>
  );
}

export default TasksList;
