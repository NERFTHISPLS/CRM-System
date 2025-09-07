import { useCallback, useEffect, useState, type JSX } from 'react';
import styles from './TasksListPage.module.scss';
import { getTasks } from '@api/tasks';
import { handleError } from '@utils/helpers';
import Loader from '@/components/ui/Loader/Loader';
import NewTaskForm from '@/components/Tasks/NewTaskForm/NewTaskForm';
import TasksFilter from '@/components/Tasks/TasksFilter/TasksFilter';
import TasksList from '@/components/Tasks/TasksList/TasksList';
import type { Todo, TodoFilterValue, TodoInfo } from '@/types/task';

function TasksListPage(): JSX.Element {
  const [filterValue, setFilterValue] = useState<TodoFilterValue>('all');
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [countInfo, setCountInfo] = useState<TodoInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // On the initial render useEffect will run fetchTasks and fetchTasks will cause rerendering.
  // Without useCallback fetchTasks will change its link in the memory, so useEffect will be called again.
  // So we will end up in the infinite loop.
  // We use separate variable for this function, because it is used in several components below.
  const fetchTasks = useCallback(
    async (isLoaderShown: boolean) => {
      setError('');
      setIsLoading(true);
      setShowLoader(isLoaderShown);

      try {
        const { data, info } = await getTasks(filterValue);

        setTasks(data);
        setCountInfo(info);
      } catch (err) {
        handleError(err, setError);
      } finally {
        setIsLoading(false);
        setShowLoader(false);
      }
    },
    [filterValue]
  );

  useEffect(() => {
    fetchTasks(true);
  }, [fetchTasks]);

  return (
    <main className={styles.main}>
      <section className={styles.todoList}>
        <NewTaskForm refetchTasks={() => fetchTasks(true)} />

        <TasksFilter
          countInfo={countInfo}
          selected={filterValue}
          onSelected={value => setFilterValue(value)}
        />

        {showLoader && isLoading ? (
          <Loader />
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <TasksList tasks={tasks} refetchTasks={() => fetchTasks(false)} />
        )}
      </section>
    </main>
  );
}

export default TasksListPage;
