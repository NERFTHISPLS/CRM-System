import { useState } from 'react';
import { useFetchTasks } from '../../hooks/useFetchTasks';
import NewTaskForm from '../NewTaskForm/NewTaskForm';
import TasksList from '../TasksList/TasksList';
import styles from './TodoListLayout.module.scss';
import type { TaskFilterValue } from '../../types/task';
import TasksFilter from '../TasksFilter/TasksFilter';
import Loader from '../Loader/Loader';

function TodoListLayout() {
  const [filterValue, setFilterValue] = useState<TaskFilterValue>('all');
  const { tasks, countInfo, isLoading, error, refetch } =
    useFetchTasks(filterValue);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className={styles.todoList}>
      <NewTaskForm refetchTasks={() => refetch(false)} />

      <TasksFilter
        countInfo={countInfo}
        selected={filterValue}
        onSelected={value => setFilterValue(value)}
      />

      <TasksList
        tasks={tasks}
        error={error}
        refetchTasks={() => refetch(false)}
      />
    </section>
  );
}

export default TodoListLayout;
