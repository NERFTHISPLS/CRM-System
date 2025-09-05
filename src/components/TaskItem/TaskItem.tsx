import { useEffect, useState } from 'react';
import { toggleTask as toggleTaskApi } from '../../api/tasks/toggleTask';
import { updateTaskTitle as updateTaskTitleApi } from '../../api/tasks/updateTaskTitle';
import type { Task } from '../../types/task';
import { handleError } from '../../utils/helpers';
import Checkbox from '../Checkbox/Checkbox';
import EditButton from '../EditButton/EditButton';
import RemoveButton from '../RemoveButton/RemoveButton';
import styles from './TaskItem.module.scss';
import SaveCancelButtons from '../SaveCancelButtons/SaveCancelButtons';
import TextInput from '../TextInput/TextInput';
import { removeTask as removeTaskApi } from '../../api/tasks/removeTask';

interface Props {
  task: Task;
  refetchTasks: () => Promise<void>;
}

function TaskItem({ task, refetchTasks }: Props) {
  const [taskTextEdit, setTaskTextEdit] = useState('');
  const [isEditSession, setIsEditSession] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setTaskTextEdit(task.title);
  }, [task.title, isEditSession]);

  async function handleTaskToggle(): Promise<void> {
    setError('');
    setIsLoading(false);

    try {
      setIsLoading(true);
      await toggleTaskApi(task.id, task.isDone);
      await refetchTasks();
      setError('');
    } catch (err) {
      handleError(err, setError);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleEditTaskText(): Promise<void> {
    setError('');
    setIsLoading(false);

    try {
      setIsLoading(true);
      await updateTaskTitleApi(task.id, taskTextEdit);
      await refetchTasks();
      setError('');
    } catch (err) {
      handleError(err, setError);
    } finally {
      setIsLoading(false);
      setIsEditSession(false);
    }
  }

  async function handleRemoveTask(): Promise<void> {
    setError('');
    setIsLoading(false);

    try {
      setIsLoading(true);
      await removeTaskApi(task.id);
      await refetchTasks();
      setError('');
    } catch (err) {
      handleError(err, setError);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <li className={styles.task}>
      {isEditSession ? (
        <TextInput
          className={styles.editInput}
          value={taskTextEdit}
          onChange={setTaskTextEdit}
        />
      ) : (
        <Checkbox
          label={task.title}
          checked={task.isDone}
          onChange={handleTaskToggle}
          errorMessage={error}
          disabled={isLoading}
        />
      )}

      <div className={styles.control}>
        {isEditSession ? (
          <SaveCancelButtons
            saveText="Save"
            cancelText="Cancel"
            onSave={handleEditTaskText}
            onCancel={() => setIsEditSession(false)}
          />
        ) : (
          <EditButton
            disabled={isLoading}
            onClick={() => setIsEditSession(true)}
          />
        )}

        <RemoveButton disabled={isLoading} onClick={handleRemoveTask} />
      </div>
    </li>
  );
}

export default TaskItem;
