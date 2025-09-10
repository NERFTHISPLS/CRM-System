import App from '@/App';
import TasksListPage from '@/pages/TasksListPage/TasksListPage';
import UserProfilePage from '@/pages/UserProfilePage/UserProfilePage';
import { createBrowserRouter } from 'react-router';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <TasksListPage /> },
      { path: 'user-profile', element: <UserProfilePage /> },
    ],
  },
]);
