import type { UserRegistration } from '@/types/auth';
import { Alert, Button, Flex, Form, Input, type FormProps } from 'antd';
import { Link } from 'react-router';
import { signUp } from '@/api/auth';
import { useState, type JSX, type ReactNode } from 'react';
import { getErrorMessage } from '@/utils/helpers';

interface FormField {
  username: string;
  login: string;
  password: string;
  passwordConfirm: string;
  email: string;
  phoneNumber?: string;
}

const MIN_LOGIN_LENGTH = 2;
const MAX_LOGIN_LENGTH = 60;
const MAX_USERNAME_LENGTH = 60;
const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 60;

const successMessage: ReactNode = (
  <>
    <p>Your new account was successfully created!</p>
    <p>You can now sign in with your data.</p>
    <Link to="/auth/sign-in">Sign In</Link>
  </>
);

function SignUpPage(): JSX.Element {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [signUpError, setSignUpError] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleSignUp: FormProps<FormField>['onFinish'] = async ({
    login,
    username,
    password,
    email,
    phoneNumber = '',
  }) => {
    const signUpReqBody: UserRegistration = {
      login,
      username,
      password,
      email,
      phoneNumber,
    };

    try {
      setSignUpError('');
      setIsSuccess(false);
      setIsLoading(true);
      await signUp(signUpReqBody);
      setIsSuccess(true);
      form.resetFields();
    } catch (err) {
      setSignUpError(getErrorMessage(err));
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex vertical align="center" gap="large">
      <h2>Sign Up</h2>

      <Form
        name="signUp"
        form={form}
        labelCol={{ span: 6 }}
        style={{ minWidth: '38rem' }}
        onFinish={handleSignUp}
      >
        <Form.Item<FormField>
          name="username"
          label="Username"
          rules={[
            { required: true, message: 'Please input your username' },
            {
              max: MAX_USERNAME_LENGTH,
              message: `Username can't be longer than ${MAX_USERNAME_LENGTH} characters`,
            },
            {
              pattern: /^[a-zA-Zа-яА-ЯёЁ]+$/,
              message: 'Username can only contain Russian and English letters',
            },
          ]}
        >
          <Input placeholder="John" disabled={isLoading} />
        </Form.Item>

        <Form.Item<FormField>
          name="login"
          label="Login"
          rules={[
            { required: true, message: 'Please input your login' },
            {
              min: MIN_LOGIN_LENGTH,
              message: `Login must be at least ${MIN_LOGIN_LENGTH} characters`,
            },
            {
              max: MAX_LOGIN_LENGTH,
              message: `Login can't be longer than ${MAX_LOGIN_LENGTH} characters`,
            },
            {
              pattern: /^[a-zA-Z]+$/,
              message: 'Login can only contain English letters',
            },
          ]}
        >
          <Input placeholder="johndoe" disabled={isLoading} />
        </Form.Item>

        <Form.Item<FormField>
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please input your password' },
            {
              min: MIN_PASSWORD_LENGTH,
              message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
            },
            {
              max: MAX_PASSWORD_LENGTH,
              message: `Password can't be longer than ${MAX_PASSWORD_LENGTH} characters`,
            },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="************" disabled={isLoading} />
        </Form.Item>

        <Form.Item<FormField>
          name="passwordConfirm"
          label="Confirm password"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }

                return Promise.reject(new Error('The passwords do not match'));
              },
            }),
          ]}
          hasFeedback
        >
          <Input.Password placeholder="************" disabled={isLoading} />
        </Form.Item>

        <Form.Item<FormField>
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please input your email' },
            {
              type: 'email',
              message: 'Please enter a valid email address',
            },
          ]}
        >
          <Input placeholder="example@mail.com" disabled={isLoading} />
        </Form.Item>

        <Form.Item<FormField>
          name="phoneNumber"
          label="Phone number"
          rules={[
            {
              // https://uibakery.io/regex-library/phone-number
              pattern: /^\+?[1-9][0-9]{7,14}$/,
              message: 'Please enter a valid phone number',
            },
          ]}
        >
          <Input placeholder="+71234567890" disabled={isLoading} />
        </Form.Item>

        <Form.Item label={null}>
          <Flex align="center" gap="middle">
            <Button type="primary" htmlType="submit" disabled={isLoading}>
              Sign Up
            </Button>

            <Link to="/auth/sign-in">Sign In</Link>
          </Flex>
        </Form.Item>
      </Form>

      {!!signUpError && (
        <Alert
          message="Error"
          description={signUpError}
          type="error"
          showIcon
          style={{ width: '100%' }}
        />
      )}

      {isSuccess && (
        <Alert
          message="Success"
          description={successMessage}
          type="success"
          showIcon
          style={{ width: '100%' }}
        />
      )}
    </Flex>
  );
}

export default SignUpPage;
