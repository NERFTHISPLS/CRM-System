import { useState } from 'react';
import { getErrorMessage } from '@utils/helpers';
import { Button, Form, Input, message, Space, type FormProps } from 'antd';
import { TODO_TITLE_INPUT_RULES } from '@/utils/constants';
import { useAppDispatch } from '@/store/hooks';
import { createTodo, fetchTodos } from '@/store/slices/todosSlice';

interface FormField {
  todoTitle: string;
}

function NewTodoForm() {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createNewTodo: FormProps<FormField>['onFinish'] = async (values) => {
    try {
      setIsLoading(true);
      await dispatch(createTodo(values.todoTitle.trim())).unwrap();
      await dispatch(fetchTodos());
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
}

export default NewTodoForm;
