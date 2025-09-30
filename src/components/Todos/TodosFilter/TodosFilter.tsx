import type { GetTodoResponse, TodoFilterValue } from '@/types/todo';
import type { JSX } from 'react';
import { Tabs, type TabsProps } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectTodosFilterValue, selectTodosList } from '@/store/selectors';
import { setFilterValue, fetchTodos } from '@/store/slices/todosSlice';
import type { AsyncRequestData } from '@/store/utils';

interface TabConfig {
  key: TodoFilterValue;
  label: string;
}

const TAB_CONFIG: TabConfig[] = [
  { key: 'all', label: 'All' },
  { key: 'inWork', label: 'In work' },
  { key: 'completed', label: 'Completed' },
];

function TodosFilter(): JSX.Element | null {
  const dispatch = useAppDispatch();
  const { data }: AsyncRequestData<GetTodoResponse> =
    useAppSelector(selectTodosList);
  const activeKey: TodoFilterValue = useAppSelector(selectTodosFilterValue);

  if (!data) {
    return null;
  }

  const tabItems: TabsProps['items'] = TAB_CONFIG.map((tab) => ({
    key: tab.key,
    label: (
      <>
        <span>{tab.label}</span> <span>({data.info[tab.key]})</span>
      </>
    ),
  }));

  async function handleTabsChange(key: string): Promise<void> {
    dispatch(setFilterValue(key as TodoFilterValue));
    await dispatch(fetchTodos());
  }

  return (
    <Tabs items={tabItems} activeKey={activeKey} onChange={handleTabsChange} />
  );
}

export default TodosFilter;
