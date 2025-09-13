import { Menu, type MenuProps } from 'antd';
import type { Key, ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router';
import { UnorderedListOutlined, UserOutlined } from '@ant-design/icons';

type MenuItem = Required<MenuProps>['items'][number];
interface MenuItemConfig {
  key: Key;
  label: ReactNode;
  icon: ReactNode;
  path: string;
}

const menuConfig: MenuItemConfig[] = [
  {
    key: 'todo-list',
    label: 'Todo List',
    icon: <UnorderedListOutlined />,
    path: '/todo-list',
  },
  {
    key: 'user-profile',
    label: 'Profile',
    icon: <UserOutlined />,
    path: '/user-profile',
  },
];

const menuItems: MenuItem[] = menuConfig.map((config) => ({
  key: config.key,
  label: <NavLink to={config.path}>{config.label}</NavLink>,
  icon: config.icon,
}));

function MenuNav() {
  const location = useLocation();

  const activeKey =
    menuConfig.find((item) => location.pathname === item.path)?.key ||
    'todo-list';

  return (
    <Menu
      items={menuItems}
      theme="dark"
      mode="inline"
      defaultSelectedKeys={[String(activeKey)]}
    />
  );
}

export default MenuNav;
