import { combineClassNames } from '../../utils/helpers';
import styles from './TextInput.module.scss';

interface Props {
  value: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  errorText?: string;
  onChange: (value: string) => void;
}

function TextInput({
  value,
  className = '',
  placeholder = '',
  disabled = false,
  errorText = '',
  onChange,
}: Props) {
  const classes = combineClassNames(styles.inputWrapper, className);

  return (
    <div className={classes}>
      <input
        className={styles.input}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
      />

      {errorText !== '' && <p className={styles.error}>{errorText}</p>}
    </div>
  );
}

export default TextInput;
