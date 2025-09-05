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
  onTaskToggle: (taskId: Task['id'], isDone: Task['isDone']) => void;
  onTaskTextUpdate: (taskId: Task['id'], text: Task['title']) => void;
  onTaskRemove: (taskId: Task['id']) => void;
}

function TaskItem({
  task,
  onTaskToggle,
  onTaskTextUpdate,
  onTaskRemove,
}: Props) {
  const [taskTextEdit, setTaskTextEdit] = useState('');
  const [isEditSession, setIsEditSession] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setTaskTextEdit(task.title);
  }, [task.title, isEditSession]);

  async function handleTaskToggle(checked: boolean): Promise<void> {
    setError('');
    setIsLoading(false);

    try {
      setIsLoading(true);
      await toggleTaskApi(task.id, task.isDone);
      onTaskToggle(task.id, checked);
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
      onTaskTextUpdate(task.id, taskTextEdit);
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
      onTaskRemove(task.id);
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
