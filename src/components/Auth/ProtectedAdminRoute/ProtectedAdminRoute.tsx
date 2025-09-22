import { useAppSelector } from '@/store/hooks';
import { selectProfile } from '@/store/selectors';
import type { AsyncRequestData } from '@/store/utils';
import type { Profile } from '@/types/user';
import { isAdmin } from '@/utils/helpers';
import { Flex, Spin } from 'antd';
import { type ReactNode } from 'react';
import { Navigate } from 'react-router';

interface Props {
  children: ReactNode;
}

function ProtectedAdminRoute({ children }: Props): ReactNode {
  const {
    data: profile,
    status: { isLoading },
    error,
  }: AsyncRequestData<Profile> = useAppSelector(selectProfile);

  if (isLoading) {
    return (
      <Flex justify="center" style={{ width: '100%', marginTop: 50 }}>
        <Spin spinning={isLoading} />
      </Flex>
    );
  }

  if (!profile || error) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  if (!isAdmin(profile.roles)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedAdminRoute;
