import type { TaskFilterValue, TaskStatusCount } from '../../types/task';
import { TASK_FILTERS } from '../../utils/constants';
import { combineClassNames } from '../../utils/helpers';

import styles from './TasksFilter.module.scss';

interface Props {
  countInfo: TaskStatusCount | null;
  selected: TaskFilterValue;
  onSelected: (selected: TaskFilterValue) => void;
}

function TasksFilter({ selected, countInfo, onSelected }: Props) {
  if (!countInfo) return null;

  function createClasses(filterValue: TaskFilterValue): string {
    return combineClassNames(
      styles.filterItem,
      selected === filterValue ? styles.active : ''
    );
  }

  return (
    <ul className={styles.filter}>
      {TASK_FILTERS.map(filter => (
        <li
          key={filter.value}
          className={createClasses(filter.value)}
          onClick={() => onSelected(filter.value)}
        >
          <span>{filter.label}</span> <span>({countInfo[filter.value]})</span>
        </li>
      ))}
    </ul>
  );
}

export default TasksFilter;
