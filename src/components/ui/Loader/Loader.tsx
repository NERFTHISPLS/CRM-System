import styles from './Loader.module.scss';
import type { JSX } from 'react';

function Loader(): JSX.Element {
  return <div className={styles.loader}></div>;
}

export default Loader;
