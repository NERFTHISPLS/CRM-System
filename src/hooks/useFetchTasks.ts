import { useEffect, useState } from 'react';
import { handleError } from '../utils/helpers';
import type { Task } from '../types/task';
import { getTasks } from '../api/tasks/getTasks';

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

        const fetchedTasks = await getTasks();

        setTasks(fetchedTasks);
      } catch (err) {
        handleError(err, setError);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTasks();
  }, []);

  return { tasks, isLoading, error };
}
