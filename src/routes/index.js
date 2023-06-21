import { Navigate, useRoutes } from 'react-router-dom';
import { Box } from '@mui/material';
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
  NewRestaurantYourApplication,
  NewRestaurantGetStarted,
  NewRestaurantCompanyInfo,
  NewRestaurantCreateRestaurant,
  NewRestaurantAddLocations,
  PageConfirmEmail,
  DealsCreate,
  DealsAll
} from './elements';
import {
  PATH_AUTH,
  PATH_DASHBOARD,
  PATH_MISC,
  PATH_NEW_RESTAURANT
} from './paths';
import { usePathAfterLogin } from '../hooks/usePathAfterLogin';
import NewRestaurantLayout from '../layouts/new-restaurant/NewRestaurantLayout';
import Test from '../pages/misc/Test';

// ----------------------------------------------------------------------

export default function Router() {
  const pathAfterLogin = usePathAfterLogin();

  return useRoutes([
    {
      path: '/',
      children: [
        { element: <Navigate to={pathAfterLogin} replace />, index: true },
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
        { element: <Navigate to={pathAfterLogin} replace />, index: true },
        { path: 'overview', element: <Overview /> },
        // { path: 'deals', element: <PageTwo /> },
        {
          path: 'deals',
          children: [
            {
              element: <Navigate to={PATH_DASHBOARD.deals_all} replace />,
              index: true
            },
            { path: 'all', element: <DealsAll /> },
            { path: 'create', element: <DealsCreate /> },
            { path: ':id', element: <PageSix /> },
            { path: 'edit/:id', element: <PageSix /> }
          ]
        },
        { path: 'restaurant', element: <PageThree /> },
        { path: 'users', element: <PageThree /> },
        { path: 'subscription', element: <PageThree /> }
      ]
    },
    {
      path: PATH_NEW_RESTAURANT.new_restaurant,
      element: (
        <AuthGuard>
          <NewRestaurantLayout />
        </AuthGuard>
      ),
      children: [
        { element: <NewRestaurantGetStarted />, index: true },
        { path: 'step-1', element: <NewRestaurantCompanyInfo /> },
        { path: 'step-2', element: <NewRestaurantCreateRestaurant /> },
        { path: 'step-3', element: <NewRestaurantAddLocations /> },
        { path: 'step-4', element: <NewRestaurantYourApplication /> },
        { path: 'subscription', element: <Box /> }
      ]
    },
    // {
    //   path: PATH_NEW_RESTAURANT.new_restaurant,
    //   element: (
    //     <AuthGuard>
    //       <NewRestaurantPage />
    //     </AuthGuard>
    //   )
    // },
    {
      element: <CompactLayout />,
      children: [
        { path: PATH_MISC.four0four, element: <Page404 /> },
        { path: PATH_MISC.confirm_email, element: <PageConfirmEmail /> },
        { path: 'test', element: <Test /> }
      ]
    },

    { path: '*', element: <Navigate to={PATH_MISC.four0four} replace /> }
  ]);
}
