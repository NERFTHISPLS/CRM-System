import { Layout, Menu, type MenuProps } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { UnorderedListOutlined } from '@ant-design/icons';
import { type Key, type ReactNode } from 'react';
import styles from './AppLayout.module.scss';
import TasksListPage from '@/pages/TasksListPage';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(key: Key, label: ReactNode, icon: ReactNode): MenuItem {
  return {
    key,
    label,
    icon,
  };
}

const menuItems: MenuItem[] = [
  getItem('todoList', 'Todo List', <UnorderedListOutlined />),
];

function AppLayout() {
  return (
    <Layout hasSider>
      <Sider className={styles.sider}>
        <Menu
          items={menuItems}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['todoList']}
        />
      </Sider>

      <Layout.Content>
        <main>
          <TasksListPage />
        </main>
      </Layout.Content>
    </Layout>
  );
}

export default AppLayout;
