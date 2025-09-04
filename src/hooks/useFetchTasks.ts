import { useEffect, useState } from 'react';
import { formatError } from '../utils/helpers';
import type { MetaResponse } from '../types/general';
import { BASE_URL } from '../utils/constants';
import type { Task, TaskStatusCount } from '../types/task';

export function useFetchTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTasks() {
      setError('');
      setIsLoading(false);

      try {
        setIsLoading(true);

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
      } finally {
        setIsLoading(false);
      }
    }

    fetchTasks();
  }, []);

  return { tasks, isLoading, error };
}
