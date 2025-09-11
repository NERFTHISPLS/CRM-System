import type { Todo } from '@/types/todo';
import TodoItem from '../TodoItem/TodoItem';
import type { JSX } from 'react';
import { List, message } from 'antd';

interface Props {
  todos: Todo[];
  refetchTodos: () => Promise<void>;
}

// there is no point to memoize this component
// because of the todos prop which always updates by fetching the data from the server
function TodoList({ todos, refetchTodos }: Props): JSX.Element {
  // We use messageApi here instead of the TodoItem because of the todo deletion.
  // When a todo is deleted, the TodoItem component is removed from the DOM before
  // the success message has a chance to be displayed.
  const [messageApi, contextHolder] = message.useMessage();

  function handleTodoSuccess(message: string): void {
    messageApi.success(message);
  }

  function handleTodoFail(message: string): void {
    messageApi.error(message);
  }

  return (
    <>
      {contextHolder}
      <List
        size="small"
        dataSource={todos}
        split={false}
        renderItem={todo => (
          <List.Item key={todo.id}>
            <TodoItem
              todo={todo}
              refetchTodos={refetchTodos}
              onTodoSuccess={handleTodoSuccess}
              onTodoFail={handleTodoFail}
            />
          </List.Item>
        )}
      />
    </>
  );
}

export default TodoList;
