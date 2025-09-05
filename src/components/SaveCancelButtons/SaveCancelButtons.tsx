import Button from '../Button/Button';

import styles from './SaveCancelButtons.module.scss';

interface Props {
  saveText: string;
  cancelText: string;
  onSave?: () => void;
  onCancel?: () => void;
}

function SaveCancelButtons({
  saveText,
  cancelText,
  onSave = () => {},
  onCancel = () => {},
}: Props) {
  return (
    <div className={styles.buttons}>
      <Button type="success" onClick={onSave}>
        {saveText}
      </Button>

      <Button type="danger" onClick={onCancel}>
        {cancelText}
      </Button>
    </div>
  );
}

export default SaveCancelButtons;
