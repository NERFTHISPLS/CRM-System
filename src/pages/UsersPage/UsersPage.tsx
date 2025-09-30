import type { GetUsersResponse, Role, User, UserFilters } from '@/types/user';
import {
  Alert,
  Button,
  Checkbox,
  Dropdown,
  Flex,
  Input,
  message,
  Modal,
  Space,
  Table,
  Tag,
  Tooltip,
  type CheckboxOptionType,
  type InputProps,
  type MenuProps,
  type TableProps,
} from 'antd';
import {
  ArrowRightOutlined,
  DeleteOutlined,
  FilterOutlined,
  MoreOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useEffect, useRef, useState, type JSX } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectUsers } from '@/store/selectors';
import type { AsyncRequestData } from '@/store/utils';
import {
  fetchUsers,
  removeUser,
  blockUser,
  unblockUser,
  changeUserRoles,
} from '@/store/slices/adminSlice';
import { getErrorMessage } from '@/utils/helpers';

const { Column } = Table;

const roleLabelsMap: Record<Role, string> = {
  ADMIN: 'Admin',
  USER: 'User',
  MODERATOR: 'Moderator',
};

const roleCheckboxOptions: CheckboxOptionType<Role>[] = Object.keys(
  roleLabelsMap
).map((key) => {
  const role = key as Role;

  return {
    value: role,
    label: roleLabelsMap[role],
  };
});

const filterMenuItems: MenuProps['items'] = [
  { key: 'all', label: 'All' },
  { key: 'blocked', label: 'Blocked' },
  { key: 'not-blocked', label: 'Not blocked' },
];

const actionsMenuItems: MenuProps['items'] = [
  { key: 'edit-roles', label: 'Edit roles', icon: <UserOutlined /> },
  { key: 'delete', label: 'Delete', icon: <DeleteOutlined />, danger: true },
];

const MODAL_CONFIRM_TITLE = 'Operation confirmation';
const USERS_PER_PAGE = 20;
const DEBOUNCE_MS = 300;

function UsersPage(): JSX.Element {
  const {
    data,
    status: { isLoading },
    error,
  }: AsyncRequestData<GetUsersResponse> = useAppSelector(selectUsers);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [filters, setFilters] = useState<UserFilters>({
    page: 0,
    limit: USERS_PER_PAGE,
  });

  const [modalRemovingUser, setModalRemovingUser] = useState<User | null>(null);
  const [modalTogglingBlockUser, setModalTogglingBlockUser] =
    useState<User | null>(null);
  const [modalEdittingRolesUser, setModalEdittingRolesUser] =
    useState<User | null>(null);
  const [modalSelectedRoles, setModalSelectedRoles] = useState<Role[]>([]);
  const [isProcessingUser, setIsProcessingUser] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    async function getUsers(): Promise<void> {
      await dispatch(fetchUsers(filters));
    }

    getUsers();

    const timeoutId = searchTimeoutRef.current;

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [dispatch, filters]);

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        style={{ width: '100%' }}
      />
    );
  }

  const totalUsers = data?.meta.totalAmount || 0;
  const showPagination = totalUsers > USERS_PER_PAGE;

  const handleTablePage: TableProps<User>['onChange'] = (
    pagination,
    _,
    sorter
  ) => {
    const newPage = (pagination.current ?? 1) - 1;

    setFilters((prev) => {
      const next: UserFilters = { ...prev };

      if (newPage !== prev.page) {
        next.page = newPage;
      }

      if (!Array.isArray(sorter)) {
        const sortOrderServer: UserFilters['sortOrder'] =
          sorter.order === 'ascend'
            ? 'asc'
            : sorter.order === 'descend'
            ? 'desc'
            : undefined;

        if (
          sorter.field !== prev.sortBy ||
          sortOrderServer !== prev.sortOrder
        ) {
          next.sortBy = sorter.field ? String(sorter.field) : undefined;
          next.sortOrder = sortOrderServer;
          next.page = 0;
        }
      }

      return next;
    });
  };

  const handleSearch: InputProps['onChange'] = (e) => {
    const value = e.target.value.trim();

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setFilters((filters) => ({ ...filters, search: value, page: 0 }));
    }, DEBOUNCE_MS);
  };

  const handleFilterChange: MenuProps['onClick'] = ({ key }) => {
    const filterIsBlocked = key === 'all' ? undefined : key === 'blocked';

    if (filterIsBlocked === filters.isBlocked) {
      return;
    }

    setFilters((filters) => ({
      ...filters,
      isBlocked: filterIsBlocked,
      page: 0,
    }));
  };

  async function handleRemoveUser(): Promise<void> {
    try {
      setIsProcessingUser(true);

      if (!modalRemovingUser) {
        throw new Error('No such user exists');
      }

      await dispatch(removeUser(modalRemovingUser.id));
      await dispatch(fetchUsers(filters));

      messageApi.success(
        `User ${modalRemovingUser.username} was deleted successfully`
      );
    } catch (err) {
      messageApi.error(getErrorMessage(err));
    } finally {
      setIsProcessingUser(false);
      setModalRemovingUser(null);
    }
  }

  async function handleToggleUserBlockStatus(): Promise<void> {
    try {
      setIsProcessingUser(true);

      if (!modalTogglingBlockUser) {
        throw new Error('No such user exists');
      }

      const { id, isBlocked, username } = modalTogglingBlockUser;

      if (isBlocked) {
        await dispatch(unblockUser(id));
      } else {
        await dispatch(blockUser(id));
      }

      await dispatch(fetchUsers(filters));

      messageApi.success(
        `User ${username} was ${
          isBlocked ? 'unblocked' : 'blocked'
        } successfully`
      );
    } catch (err) {
      messageApi.error(getErrorMessage(err));
    } finally {
      setIsProcessingUser(false);
      setModalTogglingBlockUser(null);
    }
  }

  async function handleEditUserRoles(): Promise<void> {
    try {
      setIsProcessingUser(true);

      if (!modalEdittingRolesUser) {
        throw new Error('No such user exists');
      }

      const { id, username, roles: oldRoles } = modalEdittingRolesUser;

      const oldRolesSet = new Set(oldRoles);
      const newRolesSet = new Set(modalSelectedRoles);

      if (
        oldRolesSet.size === newRolesSet.size &&
        [...oldRolesSet].every((role) => newRolesSet.has(role))
      ) {
        return;
      }

      await dispatch(
        changeUserRoles({
          id,
          roles: modalSelectedRoles.length > 0 ? modalSelectedRoles : ['USER'],
        })
      );
      await dispatch(fetchUsers(filters));

      messageApi.success(
        `Roles of the user ${username} were changed successfully`
      );
    } catch (err) {
      messageApi.error(getErrorMessage(err));
    } finally {
      setIsProcessingUser(false);
      setModalEdittingRolesUser(null);
      setModalSelectedRoles([]);
    }
  }

  function handleActionsMenuClick(key: string, targetUser: User) {
    if (key === 'delete') {
      setModalRemovingUser(targetUser);
    } else if (key === 'edit-roles') {
      setModalEdittingRolesUser(targetUser);
      setModalSelectedRoles(targetUser.roles);
    }
  }

  return (
    <>
      {contextHolder}
      <Flex vertical gap="middle" style={{ padding: '1rem' }}>
        <h2>Users Info</h2>

        <Flex gap="small">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search by username or email..."
            onChange={handleSearch}
          />

          <Dropdown
            menu={{
              items: filterMenuItems,
              selectable: true,
              defaultSelectedKeys: ['all'],
              onClick: handleFilterChange,
            }}
          >
            <Button>
              <Space>
                <FilterOutlined />
                Filter
              </Space>
            </Button>
          </Dropdown>
        </Flex>

        <Table<User>
          dataSource={data?.data ?? []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            total: totalUsers,
            position: [showPagination ? 'bottomCenter' : 'none'],
            pageSize: USERS_PER_PAGE,
            showSizeChanger: false,
            current: (filters.page ?? 0) + 1,
          }}
          scroll={{ x: 'max-content', scrollToFirstRowOnChange: true }}
          onChange={handleTablePage}
        >
          <Column
            title="Username"
            dataIndex="username"
            key="username"
            fixed="left"
            sorter={true}
          />

          <Column title="Email" dataIndex="email" key="email" sorter={true} />

          <Column
            title="Registration date"
            dataIndex="date"
            key="date"
            render={(date: string) =>
              new Intl.DateTimeFormat().format(new Date(date))
            }
          />

          <Column
            title="Is blocked"
            dataIndex="isBlocked"
            key="isBlocked"
            render={(isBlocked: boolean) => (isBlocked ? '+' : '-')}
          />

          <Column
            title="Roles"
            dataIndex="roles"
            key="roles"
            render={(roles: Role[]) =>
              roles.map((role) => {
                let color = '';
                switch (role) {
                  case 'ADMIN':
                    color = 'geekblue';
                    break;
                  case 'MODERATOR':
                    color = 'orange';
                    break;
                  case 'USER':
                    color = 'purple';
                    break;
                }

                return (
                  <Tag color={color} key={role}>
                    {roleLabelsMap[role]}
                  </Tag>
                );
              })
            }
          />

          <Column
            title="Phone number"
            dataIndex="phoneNumber"
            key="phoneNumber"
          />

          <Column
            key="actions"
            render={(_, record: User) => (
              <Space>
                <Tooltip title="Go to the profile">
                  <Button
                    variant="outlined"
                    icon={<ArrowRightOutlined />}
                    onClick={() => navigate(`/users/user-profile/${record.id}`)}
                  />
                </Tooltip>

                <Button
                  variant="outlined"
                  style={{ minWidth: 90 }}
                  onClick={() => setModalTogglingBlockUser(record)}
                >
                  {record.isBlocked ? 'Unblock' : 'Block'}
                </Button>

                <Dropdown
                  menu={{
                    items: actionsMenuItems,
                    onClick: ({ key }) => handleActionsMenuClick(key, record),
                  }}
                >
                  <Button variant="outlined" icon={<MoreOutlined />} />
                </Dropdown>
              </Space>
            )}
          />
        </Table>
      </Flex>

      <Modal
        title={MODAL_CONFIRM_TITLE}
        closable
        centered
        okText="Yes"
        confirmLoading={isProcessingUser}
        okButtonProps={{ color: 'danger', variant: 'outlined' }}
        open={Boolean(modalRemovingUser)}
        onOk={handleRemoveUser}
        onCancel={() => setModalRemovingUser(null)}
      >
        <p>
          Are you sure you want to delete user {modalRemovingUser?.username}{' '}
          with id {modalRemovingUser?.id}?
        </p>
      </Modal>

      <Modal
        title="Edit roles"
        closable
        centered
        confirmLoading={isProcessingUser}
        open={Boolean(modalEdittingRolesUser)}
        onOk={handleEditUserRoles}
        onCancel={() => {
          setModalEdittingRolesUser(null);
          setModalSelectedRoles([]);
        }}
      >
        <Flex vertical gap="small">
          <p>
            Edit roles for user {modalEdittingRolesUser?.username} with id{' '}
            {modalEdittingRolesUser?.id}
          </p>

          <Checkbox.Group
            value={modalSelectedRoles}
            options={roleCheckboxOptions}
            onChange={(roles: Role[]) => setModalSelectedRoles(roles)}
          />
        </Flex>
      </Modal>

      <Modal
        title={MODAL_CONFIRM_TITLE}
        closable
        centered
        okText="Yes"
        confirmLoading={isProcessingUser}
        open={Boolean(modalTogglingBlockUser)}
        onOk={handleToggleUserBlockStatus}
        onCancel={() => setModalTogglingBlockUser(null)}
      >
        <p>
          Are you sure you want to{' '}
          {modalTogglingBlockUser?.isBlocked ? 'unblock' : 'block'} user{' '}
          {modalTogglingBlockUser?.username} with id{' '}
          {modalTogglingBlockUser?.id}?
        </p>
      </Modal>
    </>
  );
}

export default UsersPage;
