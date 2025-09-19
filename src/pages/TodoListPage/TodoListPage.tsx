import { useCallback, useEffect, useState, type JSX } from 'react';
import styles from './TodoListPage.module.scss';
import NewTodoForm from '@/components/Todos/NewTodoForm/NewTodoForm';
import TodosFilter from '@/components/Todos/TodosFilter/TodosFilter';
import TodoList from '@/components/Todos/TodoList/TodoList';
import { Alert, Flex, Spin } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTodos } from '@/store/slices/todosSlice';
import { selectTodosList } from '@/store/selectors';

const REFETCH_TODOS_INTERVAL_MS = 5000;

function TodoListPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const {
    status: { isLoading },
    error,
  }: ReturnType<typeof selectTodosList> = useAppSelector(selectTodosList);
  const [showLoader, setShowLoader] = useState<boolean>(false);

  // On the initial render useEffect will run fetchTodos and fetchTodos will cause rerendering.
  // Without useCallback fetchTodos will change its link in the memory, so useEffect will be called again.
  // So we will end up in the infinite loop.
  // We use separate variable for this function, because it is used in several components below.
  const fetchTodosCallback = useCallback(
    async (isLoaderShown: boolean) => {
      setShowLoader(isLoaderShown);
      await dispatch(fetchTodos());
      setShowLoader(false);
    },
    [dispatch]
  );

  useEffect(() => {
    fetchTodosCallback(true);

    const intervalId = setInterval(
      () => fetchTodosCallback(false),
      REFETCH_TODOS_INTERVAL_MS
    );

    return () => clearInterval(intervalId);
  }, [fetchTodosCallback]);

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <Flex className={styles.container} vertical>
      <NewTodoForm />

      <TodosFilter />

      <Spin spinning={showLoader && isLoading} tip="Loading your tasks...">
        <TodoList />
      </Spin>
    </Flex>
  );
}

export default TodoListPage;
