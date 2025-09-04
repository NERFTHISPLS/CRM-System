import type { ReactNode } from 'react';

import styles from './Button.module.scss';
import { combineClassNames } from '../../utils/helpers';

interface Props {
  size?: 'small' | 'medium';
  type?: 'danger' | 'neutral';
  children: ReactNode;
}

function Button({ size = 'small', type = 'neutral', children }: Props) {
  const classes = combineClassNames(styles.button, styles[size], styles[type]);

  return <button className={classes}>{children}</button>;
}

export default Button;
