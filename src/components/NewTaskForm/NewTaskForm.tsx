import { useState } from 'react';
import Button from '../Button/Button';

import styles from './NewTaskForm.module.scss';

function NewTaskForm() {
  const [taskText, setTaskText] = useState('');

  return (
    <form className={styles.form}>
      <input
        className={styles.input}
        type="text"
        placeholder="Task to be done..."
        value={taskText}
        onChange={e => setTaskText(e.target.value)}
      />
      <Button size="medium">Add</Button>
    </form>
  );
}

export default NewTaskForm;
