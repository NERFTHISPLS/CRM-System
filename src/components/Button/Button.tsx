import type { ReactNode } from 'react';

import styles from './Button.module.scss';
import { combineClassNames } from '../../utils/helpers';

interface Props {
  size?: 'small' | 'medium';
  type?: 'danger' | 'neutral' | 'success';
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

function Button({
  size = 'small',
  type = 'neutral',
  disabled = false,
  onClick = () => {},
  children,
}: Props) {
  const classes = combineClassNames(styles.button, styles[size], styles[type]);

  return (
    <button className={classes} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
