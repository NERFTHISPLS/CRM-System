import { combineClassNames } from '../../utils/helpers';
import Button from '../Button/Button';

import styles from './EditButton.module.scss';

const classes = combineClassNames('material-symbols-outlined', styles.icon);

interface Props {
  disabled?: boolean;
  onClick: () => void;
}

function EditButton({ disabled = false, onClick }: Props) {
  return (
    <Button disabled={disabled} onClick={onClick}>
      <span className={classes}>edit_square</span>
    </Button>
  );
}

export default EditButton;
