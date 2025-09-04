import { useEffect, useState } from 'react';
import TaskItem from '../TaskItem/TaskItem';
import styles from './TasksList.module.scss';
import { BASE_URL } from '../../utils/constants';
import type { GetTasksResponse, Task } from '../../types/task';
import { formatError } from '../../utils/helpers';

function TasksList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTasks() {
      setError('');
      try {
        const res = await fetch(`${BASE_URL}/todos`);
        const { data } = (await res.json()) as GetTasksResponse;

        setTasks(data);
      } catch (err) {
        console.error(err);

        if (err instanceof Error) {
          setError(formatError(err.message));
        }
      }
    }

    fetchTasks();
  }, []);

  return error === '' ? (
    <ul className={styles.list}>
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  ) : (
    <p>{error}</p>
  );
}

export default TasksList;
