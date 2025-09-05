import { useEffect, useMemo, useState } from 'react';
import { useFetchTasks } from '../../hooks/useFetchTasks';
import NewTaskForm from '../NewTaskForm/NewTaskForm';
import TasksList from '../TasksList/TasksList';
import styles from './AppLayout.module.scss';
import type { Task, TaskFilterValue } from '../../types/task';
import TasksFilter from '../TasksFilter/TasksFilter';
import { calcCountInfo, filterTasks } from '../../utils/helpers';

function AppLayout() {
  const { tasks: initialTasks, isLoading, error } = useFetchTasks();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterValue, setFilterValue] = useState<TaskFilterValue>('all');

  useEffect(() => {
    if (!initialTasks.length) return;

    setTasks(initialTasks);
  }, [initialTasks]);

  const filteredTasks = useMemo(
    () => filterTasks(tasks, filterValue),
    [tasks, filterValue]
  );

  const countInfo = useMemo(() => calcCountInfo(tasks), [tasks]);

  function handleNewTask(newTask: Task): void {
    setTasks(prev => [...prev, newTask]);
  }

  function handleTaskToggle(
    targetTaskId: Task['id'],
    isDone: Task['isDone']
  ): void {
    setTasks(prev =>
      prev.map(task => (task.id === targetTaskId ? { ...task, isDone } : task))
    );
  }

  function handleTaskTextUpdate(
    targetTaskId: Task['id'],
    text: Task['title']
  ): void {
    setTasks(prev =>
      prev.map(task =>
        task.id === targetTaskId ? { ...task, title: text } : task
      )
    );
  }

  function handleTaskRemove(targetTask: Task): void {
    setTasks(prev => prev.filter(task => task.id !== targetTask.id));
  }

  return (
    <section className={styles.todoList}>
      <NewTaskForm onTaskCreation={handleNewTask} />

      <TasksFilter
        countInfo={countInfo}
        selected={filterValue}
        onSelected={value => setFilterValue(value)}
      />

      <TasksList
        tasks={filteredTasks}
        isLoading={isLoading}
        error={error}
        onTaskToggle={handleTaskToggle}
        onTaskTextUpdate={handleTaskTextUpdate}
        onTaskRemove={handleTaskRemove}
      />
    </section>
  );
}

export default AppLayout;
