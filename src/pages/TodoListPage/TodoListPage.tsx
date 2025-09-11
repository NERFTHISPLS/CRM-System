import { useCallback, useEffect, useState, type JSX } from 'react';
import styles from './TodoListPage.module.scss';
import { getTodos } from '@/api/todo';
import { getErrorMessage } from '@utils/helpers';
import NewTodoForm from '@/components/Todos/NewTodoForm/NewTodoForm';
import TodosFilter from '@/components/Todos/TodosFilter/TodosFilter';
import TodoList from '@/components/Todos/TodoList/TodoList';
import type { Todo, TodoFilterValue, TodoInfo } from '@/types/todo';
import { Alert, Flex, Spin } from 'antd';

const REFETCH_TODOS_INTERVAL_MS = 5000;

function TodoListPage(): JSX.Element {
  const [filterValue, setFilterValue] = useState<TodoFilterValue>('all');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [countInfo, setCountInfo] = useState<TodoInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // On the initial render useEffect will run fetchTodos and fetchTodos will cause rerendering.
  // Without useCallback fetchTodos will change its link in the memory, so useEffect will be called again.
  // So we will end up in the infinite loop.
  // We use separate variable for this function, because it is used in several components below.
  const fetchTodos = useCallback(
    async (isLoaderShown: boolean) => {
      setError('');
      setIsLoading(true);
      setShowLoader(isLoaderShown);

      try {
        const { data, info } = await getTodos(filterValue);

        setTodos(data);
        setCountInfo(info);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
        setShowLoader(false);
      }
    },
    [filterValue]
  );

  const fetchTodosShowingLoader = useCallback(async () => {
    fetchTodos(true);
  }, [fetchTodos]);

  useEffect(() => {
    fetchTodos(true);

    const intervalId = setInterval(
      () => fetchTodos(false),
      REFETCH_TODOS_INTERVAL_MS
    );

    return () => clearInterval(intervalId);
  }, [fetchTodos]);

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <Flex className={styles.container} vertical>
      <NewTodoForm refetchTodos={fetchTodosShowingLoader} />

      <TodosFilter
        countInfo={countInfo}
        onSelected={value => setFilterValue(value)}
      />

      <Spin spinning={showLoader && isLoading} tip="Loading your tasks...">
        <TodoList todos={todos} refetchTodos={() => fetchTodos(false)} />
      </Spin>
    </Flex>
  );
}

export default TodoListPage;
