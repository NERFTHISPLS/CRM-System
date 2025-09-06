import TodoListLayout from '../components/TodoListLayout/TodoListLayout';

import styles from './TasksListPage.module.scss';

function TasksListPage() {
  return (
    <main className={styles.main}>
      <TodoListLayout />
    </main>
  );
}

export default TasksListPage;
