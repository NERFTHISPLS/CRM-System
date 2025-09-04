import TasksList from '../TasksList/TasksList';
import styles from './AppLayout.module.scss';

function AppLayout() {
  return (
    <section className={styles.todoList}>
      <TasksList />
    </section>
  );
}

export default AppLayout;
