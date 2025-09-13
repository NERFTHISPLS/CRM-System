import App from '@/App';
import AuthLayout from '@/components/ui/AuthLayout/AuthLayout';
import SignInPage from '@/pages/SignInPage/SignInPage';
import SignUpPage from '@/pages/SignUpPage/SignUpPage';
import TodoListPage from '@/pages/TodoListPage/TodoListPage';
import UserProfilePage from '@/pages/UserProfilePage/UserProfilePage';
import { createBrowserRouter } from 'react-router';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <TodoListPage /> },
      { path: 'todo-list', element: <TodoListPage /> },
      { path: 'user-profile', element: <UserProfilePage /> },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'sign-up', element: <SignUpPage /> },
      { path: 'sign-in', element: <SignInPage /> },
    ],
  },
]);
