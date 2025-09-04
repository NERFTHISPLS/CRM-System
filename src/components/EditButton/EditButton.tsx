import { combineClassNames } from '../../utils/helpers';
import Button from '../Button/Button';

import styles from './EditButton.module.scss';

const classes = combineClassNames('material-symbols-outlined', styles.icon);

function EditButton() {
  return (
    <Button>
      <span className={classes}>edit_square</span>
    </Button>
  );
}

export default EditButton;
