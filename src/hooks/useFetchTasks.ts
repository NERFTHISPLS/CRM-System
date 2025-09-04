import { useEffect, useState } from 'react';
import { formatError } from '../utils/helpers';
import type { MetaResponse } from '../types/general';
import { BASE_URL } from '../utils/constants';
import type { Task, TaskStatusCount } from '../types/task';

export function useFetchTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTasks() {
      setError('');
      try {
        const res = await fetch(`${BASE_URL}/todos`);
        const { data } = (await res.json()) as MetaResponse<
          Task,
          TaskStatusCount
        >;

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

  return { tasks, error };
}
