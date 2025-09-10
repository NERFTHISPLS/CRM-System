import { useState, type JSX } from 'react';
import { createTodo } from '@/api/todo';
import { getErrorMessage } from '@utils/helpers';
import { Button, Form, Input, message, Space, type FormProps } from 'antd';
import {
  MAX_TODO_TITLE_LENGTH,
  MIN_TODO_TITLE_LENGTH,
} from '@/utils/constants';
import {
  ERROR_EMPTY_TODO_TEXT,
  ERROR_TODO_TEXT_ONLY_SPACES,
  ERROR_TODO_TEXT_TOO_LONG,
  ERROR_TODO_TEXT_TOO_SHORT,
} from '@/utils/errors';

interface FormField {
  todoTitle: string;
}

interface Props {
  refetchTodos: () => Promise<void>;
}

function NewTodoForm({ refetchTodos }: Props): JSX.Element {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createNewTodo: FormProps<FormField>['onFinish'] = async values => {
    try {
      setIsLoading(true);
      await createTodo(values.todoTitle.trim());
      await refetchTodos();
      form.resetFields();
      messageApi.success('Task was created successfully');
    } catch (err) {
      messageApi.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Form
        form={form}
        name="newTodo"
        onFinish={createNewTodo}
        autoComplete="off"
      >
        <Space.Compact block>
          <Form.Item<FormField>
            name="todoTitle"
            style={{ flex: 1 }}
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
              placeholder="Task title to be done..."
              disabled={isLoading}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={isLoading}>
              Add
            </Button>
          </Form.Item>
        </Space.Compact>
      </Form>
    </>
  );
}

export default NewTodoForm;
