import { combineClassNames } from '@utils/helpers';

import styles from './TasksFilter.module.scss';
import type { TodoFilter, TodoFilterValue, TodoInfo } from '@/types/task';
import type { JSX } from 'react';

const TASK_FILTERS: TodoFilter[] = [
  { label: 'All', value: 'all' },
  { label: 'In work', value: 'inWork' },
  { label: 'Completed', value: 'completed' },
];

interface Props {
  countInfo: TodoInfo | null;
  selected: TodoFilterValue;
  onSelected: (selected: TodoFilterValue) => void;
}

function TasksFilter({
  selected,
  countInfo,
  onSelected,
}: Props): JSX.Element | null {
  if (!countInfo) {
    return null;
  }

  function createClasses(filterValue: TodoFilterValue): string {
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
