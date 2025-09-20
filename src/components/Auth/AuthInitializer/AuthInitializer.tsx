import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectIsInitialized, selectAuthSignIn } from '@/store/selectors';
import {
  fetchTokens,
  setIsAuthenticated,
  setIsInitialized,
} from '@/store/slices/authSlice';
import type { AsyncRequestData } from '@/store/utils';
import type { Token } from '@/types/auth';
import { tokenService } from '@/utils/tokenService';
import { Flex, Spin } from 'antd';
import { useEffect, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

function AuthInitializer({ children }: Props): ReactNode {
  const dispatch = useAppDispatch();
  const isInitialized: boolean = useAppSelector(selectIsInitialized);
  const {
    status: { isLoading },
  }: AsyncRequestData<Token> = useAppSelector(selectAuthSignIn);

  useEffect(() => {
    async function init(): Promise<void> {
      const { refreshToken } = tokenService.getTokens();
      if (refreshToken) {
        try {
          await dispatch(fetchTokens(refreshToken)).unwrap();
          dispatch(setIsAuthenticated(true));
        } catch {
          dispatch(setIsAuthenticated(false));
        }
      } else {
        dispatch(setIsAuthenticated(false));
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
