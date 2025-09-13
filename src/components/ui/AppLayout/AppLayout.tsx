import { Layout } from 'antd';
import Sider from 'antd/es/layout/Sider';
import styles from './AppLayout.module.scss';
import { Outlet } from 'react-router';
import MenuNav from '../MenuNav/MenuNav';

function AppLayout() {
  return (
    <Layout hasSider>
      <Sider className={styles.sider}>
        <MenuNav />
      </Sider>

      <Layout.Content>
        <main>
          <Outlet />
        </main>
      </Layout.Content>
    </Layout>
  );
}

export default AppLayout;
