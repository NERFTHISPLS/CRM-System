import { Menu, type MenuProps } from 'antd';
import type { Key, ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router';
import {
  AuditOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useAppSelector } from '@/store/hooks';
import { selectProfile } from '@/store/selectors';
import type { AsyncRequestData } from '@/store/utils';
import type { Profile, Role } from '@/types/user';

type MenuItem = Required<MenuProps>['items'][number];
interface MenuItemConfig {
  key: Key;
  label: ReactNode;
  icon: ReactNode;
  path: string;
  allowedRoles: Role[];
}

const menuConfig: MenuItemConfig[] = [
  {
    key: 'todo-list',
    label: 'Todo List',
    icon: <UnorderedListOutlined />,
    path: '/todo-list',
    allowedRoles: ['USER'],
  },
  {
    key: 'user-profile',
    label: 'Profile',
    icon: <UserOutlined />,
    path: '/user-profile',
    allowedRoles: ['USER'],
  },
  {
    key: 'users',
    label: 'Users',
    icon: <AuditOutlined />,
    path: '/users',
    allowedRoles: ['ADMIN', 'MODERATOR'],
  },
];

function MenuNav() {
  const { data: profile }: AsyncRequestData<Profile> =
    useAppSelector(selectProfile);
  const location = useLocation();

  if (!profile) {
    return null;
  }

  const menuItems: MenuItem[] = menuConfig
    .filter((config) =>
      config.allowedRoles.some((role) => profile.roles.includes(role))
    )
    .map((config) => ({
      key: config.key,
      label: <NavLink to={config.path}>{config.label}</NavLink>,
      icon: config.icon,
    }));

  const activeKey =
    menuConfig.find((item) => location.pathname.startsWith(item.path))?.key ||
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
