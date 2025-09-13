import type { TodoFilterValue, TodoInfo } from '@/types/todo';
import type { JSX } from 'react';
import { Tabs, type TabsProps } from 'antd';

interface TabConfig {
  key: TodoFilterValue;
  label: string;
}

const TAB_CONFIG: TabConfig[] = [
  { key: 'all', label: 'All' },
  { key: 'inWork', label: 'In work' },
  { key: 'completed', label: 'Completed' },
];

interface Props {
  countInfo: TodoInfo | null;
  onSelected: (selected: TodoFilterValue) => void;
}

function TodosFilter({ countInfo, onSelected }: Props): JSX.Element | null {
  if (!countInfo) {
    return null;
  }

  const tabItems: TabsProps['items'] = TAB_CONFIG.map((tab) => ({
    key: tab.key,
    label: (
      <>
        <span>{tab.label}</span> <span>({countInfo[tab.key]})</span>
      </>
    ),
  }));

  return (
    <Tabs
      items={tabItems}
      onChange={(key) => onSelected(key as TodoFilterValue)}
    />
  );
}

export default TodosFilter;
