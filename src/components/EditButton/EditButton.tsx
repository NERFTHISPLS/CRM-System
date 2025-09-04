import { combineClassNames } from '../../utils/helpers';
import Button from '../Button/Button';

import styles from './EditButton.module.scss';

const classes = combineClassNames('material-symbols-outlined', styles.icon);

interface Props {
  disabled?: boolean;
}

function EditButton({ disabled = false }: Props) {
  return (
    <Button disabled={disabled}>
      <span className={classes}>edit_square</span>
    </Button>
  );
}

export default EditButton;
