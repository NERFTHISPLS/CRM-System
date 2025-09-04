import { useState, type FormEvent } from 'react';
import Button from '../Button/Button';

import styles from './NewTaskForm.module.scss';
import { validateTaskText } from '../../utils/validators';
import { ERROR_TASK_TEXT_LENGTH } from '../../utils/errors';

function NewTaskForm() {
  const [taskText, setTaskText] = useState('');
  const [error, setError] = useState('');

  function createNewTask(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    if (!validateTaskText(taskText)) {
      setError(ERROR_TASK_TEXT_LENGTH);
      return;
    }

    setTaskText('');
    setError('');

    // TODO: add request to api later
  }

  return (
    <form className={styles.form} onSubmit={createNewTask}>
      <div className={styles.inputWrapper}>
        <input
          className={styles.input}
          type="text"
          placeholder="Task to be done..."
          value={taskText}
          onChange={e => setTaskText(e.target.value)}
        />

        {error !== '' && <p className={styles.error}>{error}</p>}
      </div>

      <Button size="medium">Add</Button>
    </form>
  );
}

export default NewTaskForm;
