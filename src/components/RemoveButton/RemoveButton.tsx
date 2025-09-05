import { combineClassNames } from '../../utils/helpers';
import Button from '../Button/Button';

import styles from './RemoveButton.module.scss';

const classes = combineClassNames('material-symbols-outlined', styles.icon);

interface Props {
  disabled?: boolean;
  onClick: () => void;
}

function RemoveButton({ disabled = false, onClick }: Props) {
  return (
    <Button type="danger" disabled={disabled} onClick={onClick}>
      <span className={classes}>delete</span>
    </Button>
  );
}

export default RemoveButton;
