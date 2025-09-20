import { useState, type JSX } from 'react';
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
import { TODO_TITLE_INPUT_RULES } from '@/utils/constants';
import type { MessageInstance } from 'antd/es/message/interface';
import { useAppDispatch } from '@/store/hooks';
import { removeTodo, updateTodo, fetchTodos } from '@/store/slices/todosSlice';

interface FormField {
  todoTitle: string;
}

interface Props {
  todo: Todo;
  messageApi: MessageInstance;
}

function TodoItem({ todo, messageApi }: Props): JSX.Element {
  const dispatch = useAppDispatch();
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
      await dispatch(
        updateTodo({ id: todo.id, fields: { isDone: !todo.isDone } })
      ).unwrap();
      await dispatch(fetchTodos());
    } catch (err) {
      messageApi.error(getErrorMessage(err));
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
      await dispatch(
        updateTodo({ id: todo.id, fields: { title: todoTitleTrimmed } })
      ).unwrap();
      await dispatch(fetchTodos());
      messageApi.success('Task was updated successfully');
    } catch (err) {
      messageApi.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
      setIsEditSession(false);
    }
  };

  async function handleRemoveTodo(): Promise<void> {
    try {
      setIsLoading(true);
      await dispatch(removeTodo(todo.id)).unwrap();
      await dispatch(fetchTodos());
      messageApi.success('Task was deleted successfully');
    } catch (err) {
      messageApi.error(getErrorMessage(err));
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
              rules={TODO_TITLE_INPUT_RULES}
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
