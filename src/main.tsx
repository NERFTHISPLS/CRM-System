import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@ant-design/v5-patch-for-react-19'; // for react 19 compatibility
import './styles/index.scss';
import { RouterProvider } from 'react-router';
import { router } from './router/router';
import { Provider } from 'react-redux';
import { store } from './store/store';
import AuthInitializer from './components/Auth/AuthInitializer/AuthInitializer';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthInitializer>
        <RouterProvider router={router} />
      </AuthInitializer>
    </Provider>
  </StrictMode>
);
