import { Flex, Layout } from 'antd';
import type { JSX } from 'react';
import { Outlet } from 'react-router';

function AuthLayout(): JSX.Element {
  return (
    <Layout style={{ height: '100vh' }}>
      <Layout.Content>
        <Flex
          vertical
          align="center"
          justify="center"
          style={{ height: '100%' }}
        >
          <Outlet />
        </Flex>
      </Layout.Content>
    </Layout>
  );
}

export default AuthLayout;
