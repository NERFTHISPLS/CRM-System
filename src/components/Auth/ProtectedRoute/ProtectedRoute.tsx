import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated } from '@/store/selectors';
import { type ReactNode } from 'react';
import { Navigate } from 'react-router';

interface Props {
  children: ReactNode;
}

function ProtectedRoute({ children }: Props): ReactNode {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return children;
  }

  return <Navigate to="/auth/sign-in" replace />;
}

export default ProtectedRoute;
