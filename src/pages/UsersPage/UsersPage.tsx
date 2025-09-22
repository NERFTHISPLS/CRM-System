import type { GetUsersResponse, Role, User, UserFilters } from '@/types/user';
import {
  Alert,
  Button,
  Dropdown,
  Flex,
  Input,
  Space,
  Table,
  Tag,
  Tooltip,
  type InputProps,
  type MenuProps,
  type TableProps,
} from 'antd';
import {
  ArrowRightOutlined,
  FilterOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useEffect, useRef, useState, type JSX } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectUsers } from '@/store/selectors';
import type { AsyncRequestData } from '@/store/utils';
import { fetchUsers } from '@/store/slices/adminSlice';

const { Column } = Table;

const roleLabelsMap: Record<Role, string> = {
  ADMIN: 'Admin',
  USER: 'User',
  MODERATOR: 'Moderator',
};

const filterMenuItems: MenuProps['items'] = [
  { key: 'all', label: 'All' },
  { key: 'blocked', label: 'Blocked' },
  { key: 'not-blocked', label: 'Not blocked' },
];

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
    const newPage = pagination.current ?? 1;
    const currentPage = (filters.page ?? 0) + 1;

    if (newPage !== currentPage) {
      setFilters((filters) => ({
        ...filters,
        page: newPage - 1,
      }));
    }

    if (Array.isArray(sorter)) {
      return;
    }

    if (
      String(sorter.field) !== filters.sortBy ||
      sorter.order !== filters.sortOrder
    ) {
      const sortOrderServer: UserFilters['sortOrder'] =
        sorter.order === 'ascend'
          ? 'asc'
          : sorter.order === 'descend'
          ? 'desc'
          : undefined;

      setFilters((filters) => ({
        ...filters,
        page: 0,
        sortBy: String(sorter.field),
        sortOrder: sortOrderServer,
      }));
    }
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

  return (
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
                  icon={<ArrowRightOutlined />}
                  onClick={() => navigate(`/users/user-profile/${record.id}`)}
                />
              </Tooltip>
            </Space>
          )}
        />
      </Table>
    </Flex>
  );
}

export default UsersPage;
