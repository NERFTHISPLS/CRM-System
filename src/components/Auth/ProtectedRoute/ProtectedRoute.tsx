import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated, selectProfile } from '@/store/selectors';
import type { AsyncRequestData } from '@/store/utils';
import type { Profile, Role } from '@/types/user';
import { Flex, Spin } from 'antd';
import { type ReactNode } from 'react';
import { Navigate } from 'react-router';

interface Props {
  availableRoles?: Role[];
  children: ReactNode;
}

function ProtectedRoute({ availableRoles, children }: Props): ReactNode {
  const isAuthenticated: boolean = useAppSelector(selectIsAuthenticated);
  const {
    data: profile,
    status: { isLoading },
    error,
  }: AsyncRequestData<Profile> = useAppSelector(selectProfile);

  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  if (availableRoles && isLoading && !profile && !error) {
    return (
      <Flex justify="center" style={{ width: '100%', marginTop: 50 }}>
        <Spin spinning={isLoading} />
      </Flex>
    );
  }

  if (availableRoles && error) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  if (
    availableRoles &&
    profile &&
    !profile.roles.some((role) => availableRoles.includes(role))
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
