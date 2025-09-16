import TodoItem from '../TodoItem/TodoItem';
import type { JSX } from 'react';
import { List, message } from 'antd';
import { useAppSelector } from '@/store/hooks';
import { selectTodos } from '@/store/selectors';

function TodoList(): JSX.Element {
  // We use messageApi here instead of the TodoItem because of the todo deletion.
  // When a todo is deleted, the TodoItem component is removed from the DOM before
  // the success message has a chance to be displayed.
  const [messageApi, contextHolder] = message.useMessage();
  const todos = useAppSelector(selectTodos);

  return (
    <>
      {contextHolder}
      <List
        size="small"
        dataSource={todos}
        split={false}
        renderItem={(todo) => (
          <List.Item key={todo.id}>
            <TodoItem todo={todo} messageApi={messageApi} />
          </List.Item>
        )}
      />
    </>
  );
}

export default TodoList;
