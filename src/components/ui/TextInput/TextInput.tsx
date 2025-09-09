import { combineClassNames } from '@utils/helpers';
import styles from './TextInput.module.scss';
import type { ChangeEvent, InputHTMLAttributes, JSX } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  errorText?: string;
}

function TextInput({
  value,
  onChange,
  className = '',
  errorText = '',
  ...props
}: Props): JSX.Element {
  const classes: string = combineClassNames(styles.inputWrapper, className);

  return (
    <div className={classes}>
      <input
        className={styles.input}
        type="text"
        placeholder={props.placeholder}
        value={value}
        onChange={onChange}
        disabled={props.disabled}
      />

      {errorText !== '' && <p className={styles.error}>{errorText}</p>}
    </div>
  );
}

export default TextInput;
