import { useEffect, useState } from 'react';
import { useFetchTasks } from '../../hooks/useFetchTasks';
import NewTaskForm from '../NewTaskForm/NewTaskForm';
import TasksList from '../TasksList/TasksList';
import styles from './AppLayout.module.scss';
import type { Task } from '../../types/task';

function AppLayout() {
  const { tasks: initialTasks, isLoading, error } = useFetchTasks();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!initialTasks.length) return;

    setTasks(initialTasks);
  }, [initialTasks]);

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

  return (
    <section className={styles.todoList}>
      <NewTaskForm onTaskCreation={handleNewTask} />
      <TasksList
        tasks={tasks}
        isLoading={isLoading}
        error={error}
        onTaskToggle={handleTaskToggle}
        onTaskTextUpdate={handleTaskTextUpdate}
      />
    </section>
  );
}

export default AppLayout;
