import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectAuthIsLoading, selectIsInitialized } from '@/store/selectors';
import { fetchTokens, setIsInitialized } from '@/store/slices/authSlice';
import { tokenService } from '@/utils/tokenService';
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
      const { refreshToken } = tokenService.getTokens();
      if (refreshToken) {
        await dispatch(fetchTokens(refreshToken));
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
