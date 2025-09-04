import { createPortal } from 'react-dom';
import styles from './Loader.module.scss';

function Loader() {
  return createPortal(<div className={styles.loader}></div>, document.body);
}

export default Loader;
