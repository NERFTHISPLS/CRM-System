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
import type { Profile } from '@/types/user';
import { isAdmin } from '@/utils/helpers';

type MenuItem = Required<MenuProps>['items'][number];
interface MenuItemConfig {
  key: Key;
  label: ReactNode;
  icon: ReactNode;
  path: string;
  adminOnly?: boolean;
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
  {
    key: 'users',
    label: 'Users',
    icon: <AuditOutlined />,
    path: '/users',
    adminOnly: true,
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
    .filter((config) => {
      if (config.adminOnly) {
        return isAdmin(profile.roles);
      }

      return true;
    })
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
