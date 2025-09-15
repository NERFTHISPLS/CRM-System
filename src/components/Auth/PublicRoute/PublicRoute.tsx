import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated } from '@/store/selectors';
import { type ReactNode } from 'react';
import { Navigate } from 'react-router';

interface Props {
  children: ReactNode;
}

function PublicRoute({ children }: Props): ReactNode {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PublicRoute;
