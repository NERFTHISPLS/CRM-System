import App from '@/App';
import ProtectedRoute from '@/components/Auth/ProtectedRoute/ProtectedRoute';
import PublicRoute from '@/components/Auth/PublicRoute/PublicRoute';
import AuthLayout from '@/components/ui/AuthLayout/AuthLayout';
import SignInPage from '@/pages/SignInPage/SignInPage';
import SignUpPage from '@/pages/SignUpPage/SignUpPage';
import TodoListPage from '@/pages/TodoListPage/TodoListPage';
import ProfilePage from '@/pages/ProfilePage/ProfilePage';
import { createBrowserRouter } from 'react-router';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <TodoListPage /> },
      { path: 'todo-list', element: <TodoListPage /> },
      { path: 'user-profile', element: <ProfilePage /> },
    ],
  },
  {
    path: '/auth',
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      { path: 'sign-up', element: <SignUpPage /> },
      { path: 'sign-in', element: <SignInPage /> },
    ],
  },
]);
