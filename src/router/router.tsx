import App from '@/App';
import TodoListPage from '@/pages/TodoListPage/TodoListPage';
import UserProfilePage from '@/pages/UserProfilePage/UserProfilePage';
import { createBrowserRouter } from 'react-router';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <TodoListPage /> },
      { path: 'user-profile', element: <UserProfilePage /> },
    ],
  },
]);
