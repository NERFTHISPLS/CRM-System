import styles from './Checkbox.module.scss';
import { combineClassNames } from '../../utils/helpers';

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

function Checkbox({ checked, label = '', onChange }: Props) {
  const classes = combineClassNames(
    styles.checkbox,
    checked ? styles.checked : ''
  );

  return (
    <label className={styles.wrapper}>
      <input
        className={classes}
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      <span className={styles.label}>{label}</span>
    </label>
  );
}

export default Checkbox;
