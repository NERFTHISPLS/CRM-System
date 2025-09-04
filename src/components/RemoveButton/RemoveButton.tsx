import { combineClassNames } from '../../utils/helpers';
import Button from '../Button/Button';

import styles from './RemoveButton.module.scss';

const classes = combineClassNames('material-symbols-outlined', styles.icon);

interface Props {
  disabled?: boolean;
}

function RemoveButton({ disabled = false }: Props) {
  return (
    <Button type="danger" disabled={disabled}>
      <span className={classes}>delete</span>
    </Button>
  );
}

export default RemoveButton;
