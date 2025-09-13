import { Button, Flex, Form, Input, type FormProps } from 'antd';
import { Link } from 'react-router';

interface FormField {
  login: string;
  password: string;
}

function SignInPage() {
  const signIn: FormProps<FormField>['onFinish'] = (values) => {
    console.log(values);
  };

  return (
    <Flex vertical align="center" gap="large">
      <h2>Sign In</h2>

      <Form
        name="signUp"
        labelCol={{ span: 6 }}
        style={{ minWidth: '38rem' }}
        onFinish={signIn}
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
    </Flex>
  );
}

export default SignInPage;
