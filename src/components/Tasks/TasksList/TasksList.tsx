import type { Todo } from '@/types/task';
import TaskItem from '../TaskItem/TaskItem';
import type { JSX } from 'react';
import { List, message } from 'antd';

interface Props {
  tasks: Todo[];
  refetchTasks: () => Promise<void>;
}

function TasksList({ tasks, refetchTasks }: Props): JSX.Element {
  // We use messageApi here instead of the TaskItem because of the task deletion.
  // When a task is deleted, the TaskItem component is removed from the DOM before
  // the success message has a chance to be displayed.
  const [messageApi, contextHolder] = message.useMessage();

  function handleTaskSuccess(message: string): void {
    messageApi.success(message);
  }

  function handleTaskFail(message: string): void {
    messageApi.error(message);
  }

  return (
    <>
      {contextHolder}
      <List
        size="small"
        dataSource={tasks}
        split={false}
        renderItem={task => (
          <List.Item key={task.id}>
            <TaskItem
              task={task}
              refetchTasks={refetchTasks}
              onTaskSuccess={handleTaskSuccess}
              onTaskFail={handleTaskFail}
            />
          </List.Item>
        )}
      />
    </>
  );
}

export default TasksList;
