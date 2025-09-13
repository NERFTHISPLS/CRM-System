import { memo, useState, type JSX } from 'react';
import { createTodo } from '@/api/todo';
import { getErrorMessage } from '@utils/helpers';
import { Button, Form, Input, message, Space, type FormProps } from 'antd';
import { TODO_TITLE_INPUT_RULES } from '@/utils/constants';

interface FormField {
  todoTitle: string;
}

interface Props {
  refetchTodos: () => Promise<void>;
}

const NewTodoForm = memo<Props>(({ refetchTodos }): JSX.Element => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createNewTodo: FormProps<FormField>['onFinish'] = async (values) => {
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
            rules={TODO_TITLE_INPUT_RULES}
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
});

export default NewTodoForm;
