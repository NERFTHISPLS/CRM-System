import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectProfile } from '@/store/selectors';
import { setIsAuthenticated } from '@/store/slices/authSlice';
import { getProfile, logout } from '@/store/slices/userSlice';
import type { AsyncRequestData } from '@/store/utils';
import type { Profile } from '@/types/user';
import { Alert, Button, Flex, Form, Input, Spin } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

interface FormField {
  username: string;
  email: string;
  phoneNumber: string;
}

function ProfilePage() {
  const {
    data: profile,
    status: { isLoading },
    error,
  }: AsyncRequestData<Profile> = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProfileInfo(): Promise<void> {
      await dispatch(getProfile());
    }

    loadProfileInfo();
  }, [dispatch]);

  async function handleLogout(): Promise<void> {
    await dispatch(logout());
    dispatch(setIsAuthenticated(false));

    navigate('/auth/sign-in', { replace: true });
  }

  if (isLoading) {
    return (
      <Flex justify="center" style={{ width: '100%', marginTop: 50 }}>
        <Spin spinning={isLoading} />
      </Flex>
    );
  }

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

  return (
    <Flex gap="middle" vertical style={{ padding: '1rem' }}>
      <Flex justify="space-between">
        <h2>Profile Info</h2>
        <Button color="primary" variant="outlined" onClick={handleLogout}>
          Logout
        </Button>
      </Flex>

      <Form labelCol={{ span: 3 }}>
        <FormItem<FormField>
          name="username"
          label="Username"
          initialValue={profile?.username}
        >
          <Input disabled />
        </FormItem>

        <FormItem<FormField>
          name="email"
          label="Email"
          initialValue={profile?.email}
        >
          <Input disabled />
        </FormItem>

        <FormItem<FormField>
          name="phoneNumber"
          label="Phone number"
          initialValue={profile?.phoneNumber}
        >
          <Input disabled />
        </FormItem>
      </Form>

      <Alert
        message="Warning"
        description="Sorry, you can't change your data now. We are working on it."
        type="warning"
        showIcon
        style={{ width: '100%' }}
      />
    </Flex>
  );
}

export default ProfilePage;
