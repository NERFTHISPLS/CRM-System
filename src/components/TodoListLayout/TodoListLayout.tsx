import { useCallback, useEffect, useState } from 'react';
import NewTaskForm from '../NewTaskForm/NewTaskForm';
import TasksList from '../TasksList/TasksList';
import styles from './TodoListLayout.module.scss';
import type { Task, TaskFilterValue, TaskStatusCount } from '../../types/task';
import TasksFilter from '../TasksFilter/TasksFilter';
import Loader from '../Loader/Loader';
import { getTasks } from '../../api/tasks/getTasks';
import { handleError } from '../../utils/helpers';

function TodoListLayout() {
  const [filterValue, setFilterValue] = useState<TaskFilterValue>('all');
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
        const { data, info } = await getTasks(filterValue);

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
    [filterValue]
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className={styles.todoList}>
      <NewTaskForm refetchTasks={() => fetchTasks(false)} />

      <TasksFilter
        countInfo={countInfo}
        selected={filterValue}
        onSelected={value => setFilterValue(value)}
      />

      <TasksList
        tasks={tasks}
        error={error}
        refetchTasks={() => fetchTasks(false)}
      />
    </section>
  );
}

export default TodoListLayout;
