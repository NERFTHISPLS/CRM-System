import type { Todo } from '@/types/task';
import TaskItem from '../TaskItem/TaskItem';
import styles from './TasksList.module.scss';
import type { JSX } from 'react';

interface Props {
  tasks: Todo[];
  refetchTasks: () => Promise<void>;
}

function TasksList({ tasks, refetchTasks }: Props): JSX.Element {
  return (
    <ul className={styles.list}>
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} refetchTasks={refetchTasks} />
      ))}
    </ul>
  );
}

export default TasksList;
