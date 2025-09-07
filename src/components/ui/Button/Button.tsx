import type { ButtonHTMLAttributes, JSX, ReactNode } from 'react';

import styles from './Button.module.scss';
import { combineClassNames } from '@utils/helpers';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'small' | 'medium';
  variant?: 'danger' | 'primary' | 'neutral';
  children: ReactNode;
}

function Button({
  size = 'small',
  variant = 'primary',
  className = '',
  children,
  ...props
}: Props): JSX.Element {
  const classes: string = combineClassNames(
    styles.button,
    styles[size],
    styles[variant],
    className
  );

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export default Button;
