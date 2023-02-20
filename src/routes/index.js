import { Navigate, useRoutes } from 'react-router-dom';
// auth
import AuthGuard from '../auth/AuthGuard';
import GuestGuard from '../auth/GuestGuard';
// layouts
import CompactLayout from '../layouts/compact';
import DashboardLayout from '../layouts/dashboard';
// config
import { PATH_AFTER_LOGIN } from '../config';
//
import {
  Page404,
  Overview,
  PageTwo,
  PageSix,
  PageFour,
  PageFive,
  LoginPage,
  PageThree,
  RegisterPage,
  NewRestaurantPage
} from './elements';
import { PATH_AUTH, PATH_NEW_RESTAURANT } from './paths';
import { usePathAfterLogin } from '../hooks/usePathAfterLogin';

// ----------------------------------------------------------------------

export default function Router() {
  const pathAfterLogin = usePathAfterLogin();
  return useRoutes([
    {
      path: '/',
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        {
          path: PATH_AUTH.login,
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          )
        },
        {
          path: PATH_AUTH.register,
          element: (
            <GuestGuard>
              <RegisterPage />
            </GuestGuard>
          )
        }
      ]
    },
    {
      path: '/dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'overview', element: <Overview /> },
        { path: 'vouchers', element: <PageTwo /> },
        { path: 'restaurant', element: <PageThree /> },
        { path: 'users', element: <PageThree /> },
        { path: 'subscription', element: <PageThree /> }
      ]
    },
    {
      path: PATH_NEW_RESTAURANT.new_restaurant,
      element: (
        <AuthGuard>
          <NewRestaurantPage />
        </AuthGuard>
      )
    },
    {
      element: <CompactLayout />,
      children: [{ path: '404', element: <Page404 /> }]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
