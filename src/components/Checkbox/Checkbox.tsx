import { useState } from 'react';
import styles from './Checkbox.module.scss';

interface Props {
  label: string;
  checked?: boolean;
}

function Checkbox({ label, checked = false }: Props) {
  const [isChecked, setIsChecked] = useState(checked);

  return (
    <label className={styles.wrapper}>
      <input
        className={`${styles.checkbox} ${isChecked ? styles.checked : ''}`}
        type="checkbox"
        checked={isChecked}
        onChange={() => setIsChecked(prev => !prev)}
      />
      <span className={styles.label}>{label}</span>
    </label>
  );
}

export default Checkbox;
