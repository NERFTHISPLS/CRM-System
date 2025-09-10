import { useState, type JSX } from 'react';
import { removeTodo, updateTodo } from '@/api/todo';
import { getErrorMessage } from '@utils/helpers';
import styles from './TodoItem.module.scss';
import type { Todo } from '@/types/todo';
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Flex,
  Form,
  Input,
  Space,
  type FormProps,
} from 'antd';
import {
  ERROR_EMPTY_TODO_TEXT,
  ERROR_TODO_TEXT_ONLY_SPACES,
  ERROR_TODO_TEXT_TOO_LONG,
  ERROR_TODO_TEXT_TOO_SHORT,
} from '@/utils/errors';
import {
  MAX_TODO_TITLE_LENGTH,
  MIN_TODO_TITLE_LENGTH,
} from '@/utils/constants';

interface FormField {
  todoTitle: string;
}

interface Props {
  todo: Todo;
  refetchTodos: () => Promise<void>;
  onTodoSuccess: (message: string) => void;
  onTodoFail: (message: string) => void;
}

function TodoItem({
  todo,
  refetchTodos,
  onTodoSuccess,
  onTodoFail,
}: Props): JSX.Element {
  const [form] = Form.useForm();
  const [isEditSession, setIsEditSession] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function handleStartEditSession(): void {
    setIsEditSession(true);
    form.setFieldValue('todoTitle', todo.title);
  }

  async function handleTodoToggle(): Promise<void> {
    try {
      setIsLoading(true);
      await updateTodo(todo.id, { isDone: !todo.isDone });
      await refetchTodos();
    } catch (err) {
      onTodoFail(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  const handleEditTodoText: FormProps<FormField>['onFinish'] = async ({
    todoTitle,
  }) => {
    const todoTitleTrimmed = todoTitle.trim();

    if (todoTitleTrimmed === todo.title) {
      setIsEditSession(false);
      return;
    }

    try {
      setIsLoading(true);
      await updateTodo(todo.id, { title: todoTitleTrimmed });
      await refetchTodos();
      onTodoSuccess('Task was updated successfully');
    } catch (err) {
      onTodoFail(getErrorMessage(err));
    } finally {
      setIsLoading(false);
      setIsEditSession(false);
    }
  };

  async function handleRemoveTodo(): Promise<void> {
    try {
      setIsLoading(true);
      await removeTodo(todo.id);
      await refetchTodos();
      onTodoSuccess('Task was deleted successfully');
    } catch (err) {
      onTodoFail(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.todo}>
      {isEditSession ? (
        <Form
          variant="underlined"
          form={form}
          autoComplete="off"
          onFinish={handleEditTodoText}
        >
          <Flex gap="middle" align="center">
            <Form.Item<FormField>
              name="todoTitle"
              style={{ margin: 0, flex: 1 }}
              rules={[
                { required: true, message: ERROR_EMPTY_TODO_TEXT },
                {
                  pattern: /^(?!\s*$).+/, // not space chars
                  message: ERROR_TODO_TEXT_ONLY_SPACES,
                },
                {
                  min: MIN_TODO_TITLE_LENGTH,
                  message: ERROR_TODO_TEXT_TOO_SHORT,
                },
                {
                  max: MAX_TODO_TITLE_LENGTH,
                  message: ERROR_TODO_TEXT_TOO_LONG,
                },
              ]}
            >
              <Input
                placeholder="Input updated task text..."
                disabled={isLoading}
                autoFocus
              />
            </Form.Item>

            <Space>
              <Button
                htmlType="submit"
                type="primary"
                disabled={isLoading}
                icon={<CheckOutlined />}
              />

              <Button
                htmlType="button"
                color="danger"
                disabled={isLoading}
                onClick={() => setIsEditSession(false)}
                icon={<CloseOutlined />}
              />
            </Space>
          </Flex>
        </Form>
      ) : (
        <Flex align="center">
          <Checkbox
            style={{
              textDecoration: todo.isDone ? 'line-through' : 'none',
              flex: 1,
            }}
            checked={todo.isDone}
            disabled={isLoading}
            onChange={handleTodoToggle}
          >
            {todo.title}
          </Checkbox>

          <Space>
            <Button
              color="primary"
              variant="filled"
              icon={<EditOutlined />}
              disabled={isLoading}
              onClick={handleStartEditSession}
            />

            <Button
              color="danger"
              variant="filled"
              icon={<DeleteOutlined />}
              disabled={isLoading}
              onClick={handleRemoveTodo}
            />
          </Space>
        </Flex>
      )}
    </div>
  );
}

export default TodoItem;
