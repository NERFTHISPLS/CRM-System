import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@ant-design/v5-patch-for-react-19'; // for react 19 compatibility
import './styles/index.scss';
import { RouterProvider } from 'react-router';
import { router } from './router/router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
