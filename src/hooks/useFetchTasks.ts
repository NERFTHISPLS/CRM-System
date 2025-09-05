import { useCallback, useEffect, useState } from 'react';
import { handleError } from '../utils/helpers';
import type { Task, TaskFilterValue, TaskStatusCount } from '../types/task';
import { getTasks } from '../api/tasks/getTasks';

export function useFetchTasks(taskFilterValue: TaskFilterValue = 'all') {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [countInfo, setCountInfo] = useState<TaskStatusCount | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTasks = useCallback(
    async (showLoader: boolean = true) => {
      setError('');

      if (showLoader) {
        setIsLoading(true);
      }

      try {
        const { data, info } = await getTasks(taskFilterValue);

        setTasks(data);
        setCountInfo(info);
      } catch (err) {
        handleError(err, setError);
      } finally {
        if (showLoader) {
          setIsLoading(false);
        }
      }
    },
    [taskFilterValue]
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, countInfo, isLoading, error, refetch: fetchTasks };
}
