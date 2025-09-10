import { useState, type JSX } from 'react';
import { removeTask, updateTask } from '@api/tasks';
import { getErrorMessage } from '@utils/helpers';
import styles from './TaskItem.module.scss';
import type { Todo } from '@/types/task';
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
  ERROR_EMPTY_TASK_TEXT,
  ERROR_TASK_TEXT_TOO_LONG,
  ERROR_TASK_TEXT_TOO_SHORT,
} from '@/utils/errors';
import { MAX_TASK_TEXT_LENGTH, MIN_TASK_TEXT_LENGTH } from '@/utils/constants';

interface FormField {
  taskText: string;
}

interface Props {
  task: Todo;
  refetchTasks: () => Promise<void>;
  onTaskSuccess: (message: string) => void;
  onTaskFail: (message: string) => void;
}

function TaskItem({
  task,
  refetchTasks,
  onTaskSuccess,
  onTaskFail,
}: Props): JSX.Element {
  const [form] = Form.useForm();
  const [isEditSession, setIsEditSession] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function handleStartEditSession(): void {
    setIsEditSession(true);
    form.setFieldValue('taskText', task.title);
  }

  async function handleTaskToggle(): Promise<void> {
    try {
      setIsLoading(true);
      await updateTask(task.id, { isDone: !task.isDone });
      await refetchTasks();
    } catch (err) {
      onTaskFail(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  const handleEditTaskText: FormProps<FormField>['onFinish'] = async ({
    taskText,
  }) => {
    if (taskText === task.title) {
      setIsEditSession(false);
      return;
    }

    try {
      setIsLoading(true);
      await updateTask(task.id, { title: taskText });
      await refetchTasks();
      onTaskSuccess('Task was updated successfully');
    } catch (err) {
      onTaskFail(getErrorMessage(err));
    } finally {
      setIsLoading(false);
      setIsEditSession(false);
    }
  };

  async function handleRemoveTask(): Promise<void> {
    try {
      setIsLoading(true);
      await removeTask(task.id);
      await refetchTasks();
      onTaskSuccess('Task was deleted successfully');
    } catch (err) {
      onTaskFail(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.task}>
      {isEditSession ? (
        <Form
          variant="underlined"
          form={form}
          autoComplete="off"
          onFinish={handleEditTaskText}
        >
          <Flex gap="middle" align="center">
            <Form.Item<FormField>
              name="taskText"
              style={{ margin: 0, flex: 1 }}
              rules={[
                { required: true, message: ERROR_EMPTY_TASK_TEXT },
                {
                  min: MIN_TASK_TEXT_LENGTH,
                  message: ERROR_TASK_TEXT_TOO_SHORT,
                },
                {
                  max: MAX_TASK_TEXT_LENGTH,
                  message: ERROR_TASK_TEXT_TOO_LONG,
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
              textDecoration: task.isDone ? 'line-through' : 'none',
              flex: 1,
            }}
            checked={task.isDone}
            disabled={isLoading}
            onChange={handleTaskToggle}
          >
            {task.title}
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
              onClick={handleRemoveTask}
            />
          </Space>
        </Flex>
      )}
    </div>
  );
}

export default TaskItem;
