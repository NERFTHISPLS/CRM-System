import { useState, type JSX } from 'react';
import { createTask } from '@api/tasks';
import { getErrorMessage } from '@utils/helpers';
import { Button, Form, Input, message, Space, type FormProps } from 'antd';
import { MAX_TASK_TEXT_LENGTH, MIN_TASK_TEXT_LENGTH } from '@/utils/constants';
import {
  ERROR_EMPTY_TASK_TEXT,
  ERROR_TASK_TEXT_TOO_LONG,
  ERROR_TASK_TEXT_TOO_SHORT,
} from '@/utils/errors';

interface FormField {
  taskText: string;
}

interface Props {
  refetchTasks: () => Promise<void>;
}

function NewTaskForm({ refetchTasks }: Props): JSX.Element {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createNewTask: FormProps<FormField>['onFinish'] = async values => {
    try {
      setIsLoading(true);
      await createTask(values.taskText);
      await refetchTasks();
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
        name="newTask"
        onFinish={createNewTask}
        autoComplete="off"
      >
        <Space.Compact block>
          <Form.Item<FormField>
            name="taskText"
            style={{ flex: 1 }}
            rules={[
              { required: true, message: ERROR_EMPTY_TASK_TEXT },
              { min: MIN_TASK_TEXT_LENGTH, message: ERROR_TASK_TEXT_TOO_SHORT },
              { max: MAX_TASK_TEXT_LENGTH, message: ERROR_TASK_TEXT_TOO_LONG },
            ]}
          >
            <Input placeholder="Task to be done..." disabled={isLoading} />
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

export default NewTaskForm;
