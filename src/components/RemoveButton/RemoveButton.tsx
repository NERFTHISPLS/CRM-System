import { combineClassNames } from '../../utils/helpers';
import Button from '../Button/Button';

import styles from './RemoveButton.module.scss';

function RemoveButton() {
  const classes = combineClassNames('material-symbols-outlined', styles.icon);

  return (
    <Button type="danger">
      <span className={classes}>delete</span>
    </Button>
  );
}

export default RemoveButton;
