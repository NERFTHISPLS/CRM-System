import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectAuthIsLoading, selectIsInitialized } from '@/store/selectors';
import { getAccessToken, setIsInitialized } from '@/store/slices/authSlice';
import { storage } from '@/utils/storage';
import { Flex, Spin } from 'antd';
import { useEffect, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

function AuthInitializer({ children }: Props): ReactNode {
  const dispatch = useAppDispatch();
  const isInitialized = useAppSelector(selectIsInitialized);
  const isLoading = useAppSelector(selectAuthIsLoading);

  useEffect(() => {
    async function init(): Promise<void> {
      const refreshToken = storage.getRefreshToken();
      if (refreshToken) {
        await dispatch(getAccessToken(refreshToken));
      }

      dispatch(setIsInitialized(true));
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
