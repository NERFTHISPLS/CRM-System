import { Menu, type MenuProps } from 'antd';
import type { Key, ReactNode } from 'react';
import { Link } from 'react-router';
import { UnorderedListOutlined, UserOutlined } from '@ant-design/icons';

type MenuItem = Required<MenuProps>['items'][number];

function getMenuItem(key: Key, label: ReactNode, icon: ReactNode): MenuItem {
  return {
    key,
    label,
    icon,
  };
}

const menuItems: MenuItem[] = [
  getMenuItem(
    'todo-list',
    'Todo List',
    <Link to="/">
      <UnorderedListOutlined />
    </Link>
  ),

  getMenuItem(
    'user-profile',
    'Profile',
    <Link to="/user-profile">
      <UserOutlined />
    </Link>
  ),
];

function MenuNav() {
  return (
    <Menu
      items={menuItems}
      theme="dark"
      mode="inline"
      defaultSelectedKeys={['todo-list']}
    />
  );
}

export default MenuNav;
