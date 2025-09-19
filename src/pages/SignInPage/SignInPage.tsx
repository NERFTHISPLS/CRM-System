import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectAuthFetchTokens, selectAuthSignIn } from '@/store/selectors';
import { setIsAuthenticated, signIn } from '@/store/slices/authSlice';
import { Alert, Button, Flex, Form, Input, type FormProps } from 'antd';
import { type JSX } from 'react';
import { Link, useNavigate } from 'react-router';

interface FormField {
  login: string;
  password: string;
}

function SignInPage(): JSX.Element {
  const { error: signInError }: ReturnType<typeof selectAuthSignIn> =
    useAppSelector(selectAuthSignIn);
  const { error: fetchTokensError }: ReturnType<typeof selectAuthFetchTokens> =
    useAppSelector(selectAuthFetchTokens);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSignIn: FormProps<FormField>['onFinish'] = async ({
    login,
    password,
  }) => {
    const action = await dispatch(signIn({ login, password }));

    if (signIn.fulfilled.match(action)) {
      dispatch(setIsAuthenticated(true));
      navigate('/', { replace: true });
    }
  };

  return (
    <Flex vertical align="center" gap="large">
      <h2>Sign In</h2>

      <Form
        name="signUp"
        labelCol={{ span: 6 }}
        style={{ minWidth: '38rem' }}
        onFinish={handleSignIn}
      >
        <Form.Item<FormField>
          name="login"
          label="Login"
          rules={[{ required: true, message: 'Please input your login' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FormField>
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please input your password' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label={null}>
          <Flex align="center" gap="middle">
            <Button type="primary" htmlType="submit">
              Sign In
            </Button>

            <Link to="/auth/sign-up">Sign Up</Link>
          </Flex>
        </Form.Item>
      </Form>

      {signInError && (
        <Alert
          message="Error"
          description={signInError}
          type="error"
          showIcon
          style={{ width: '100%' }}
        />
      )}

      {fetchTokensError && (
        <Alert
          message="Warning"
          description={fetchTokensError}
          type="warning"
          showIcon
          style={{ width: '100%' }}
        />
      )}
    </Flex>
  );
}

export default SignInPage;
