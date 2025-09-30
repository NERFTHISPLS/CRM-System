import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectIsInitialized } from '@/store/selectors';
import {
  fetchTokens,
  setIsAuthenticated,
  setIsInitialized,
} from '@/store/slices/authSlice';
import { getProfile } from '@/store/slices/userSlice';
import { tokenService } from '@/utils/tokenService';
import { Flex, Spin } from 'antd';
import { useEffect, useState, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

function AuthInitializer({ children }: Props): ReactNode {
  const dispatch = useAppDispatch();
  const isInitialized: boolean = useAppSelector(selectIsInitialized);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function init(): Promise<void> {
      try {
        const { refreshToken } = tokenService.getTokens();
        if (refreshToken) {
          await dispatch(fetchTokens(refreshToken)).unwrap();
          await dispatch(getProfile()).unwrap();
          dispatch(setIsAuthenticated(true));
        } else {
          dispatch(setIsAuthenticated(false));
        }
      } catch {
        dispatch(setIsAuthenticated(false));
      } finally {
        dispatch(setIsInitialized(true));
        setIsLoading(false);
      }
    }

    init();
  }, [dispatch]);

  if (!isInitialized || isLoading) {
    return (
      <Flex justify="center" style={{ marginTop: 50 }}>
        <Spin size="large" />
      </Flex>
    );
  }

  return children;
}

export default AuthInitializer;
