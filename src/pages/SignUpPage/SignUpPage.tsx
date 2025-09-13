import { Button, Flex, Form, Input, type FormProps } from 'antd';
import { Link } from 'react-router';

interface FormField {
  name: string;
  login: string;
  password: string;
  passwordConfirm: string;
  email: string;
  phone?: string;
}

const MIN_LOGIN_LENGTH = 2;
const MAX_LOGIN_LENGTH = 60;
const MAX_USERNAME_LENGTH = 60;
const MIN_PASSWORD_LENGTH = 2;
const MAX_PASSWORD_LENGTH = 60;

function SignUpPage() {
  const signUp: FormProps<FormField>['onFinish'] = (values) => {
    console.log(values);
  };

  return (
    <Flex vertical align="center" gap="large">
      <h2>Sign Up</h2>

      <Form
        name="signUp"
        labelCol={{ span: 6 }}
        style={{ minWidth: '38rem' }}
        onFinish={signUp}
      >
        <Form.Item<FormField>
          name="name"
          label="Username"
          rules={[
            { required: true, message: 'Please input your username' },
            {
              max: MAX_USERNAME_LENGTH,
              message: `Username can't be longer than ${MAX_USERNAME_LENGTH} characters`,
            },
            {
              pattern: /^[a-zA-Zа-яА-ЯёЁ\s]+$/,
              message: 'Username can only contain Russian and English letters',
            },
          ]}
        >
          <Input placeholder="John Doe" />
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
          <Input placeholder="johndoe" />
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
          <Input.Password placeholder="************" />
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
          <Input.Password placeholder="************" />
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
          <Input placeholder="example@mail.com" />
        </Form.Item>

        <Form.Item<FormField>
          name="phone"
          label="Phone number"
          rules={[
            {
              // https://uibakery.io/regex-library/phone-number
              pattern: /^\+?[1-9][0-9]{7,14}$/,
              message: 'Please enter a valid phone number',
            },
          ]}
        >
          <Input placeholder="+71234567890" />
        </Form.Item>

        <Form.Item label={null}>
          <Flex align="center" gap="middle">
            <Button type="primary" htmlType="submit">
              Sign Up
            </Button>

            <Link to="/auth/sign-in">Sign In</Link>
          </Flex>
        </Form.Item>
      </Form>
    </Flex>
  );
}

export default SignUpPage;
