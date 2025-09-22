import type { GetUsersResponse, Role, User } from '@/types/user';
import {
  Alert,
  Button,
  Flex,
  Space,
  Table,
  Tag,
  Tooltip,
  type TableProps,
} from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useEffect, type JSX } from 'react';
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

const USERS_PER_PAGE = 20;

function UsersPage(): JSX.Element {
  const {
    data,
    status: { isLoading },
    error,
  }: AsyncRequestData<GetUsersResponse> = useAppSelector(selectUsers);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    async function getUsers(): Promise<void> {
      await dispatch(fetchUsers({ limit: USERS_PER_PAGE, page: 0 }));
    }

    getUsers();
  }, [dispatch]);

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

  const handleChangePage: TableProps<User>['onChange'] = async (pagination) => {
    await dispatch(
      fetchUsers({ limit: USERS_PER_PAGE, page: (pagination.current ?? 1) - 1 })
    );
  };

  return (
    <Flex vertical gap="middle" style={{ padding: '1rem' }}>
      <h2>Users Info</h2>

      <Table<User>
        dataSource={data?.data ?? []}
        rowKey="id"
        loading={isLoading}
        pagination={{
          total: totalUsers,
          position: [showPagination ? 'bottomCenter' : 'none'],
          pageSize: USERS_PER_PAGE,
          showSizeChanger: false,
        }}
        scroll={{ x: 'max-content', scrollToFirstRowOnChange: true }}
        onChange={handleChangePage}
      >
        <Column
          title="Username"
          dataIndex="username"
          key="username"
          fixed="left"
        />

        <Column title="Email" dataIndex="email" key="email" />

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
