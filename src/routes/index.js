import { Navigate, useRoutes } from 'react-router-dom';
import { Box } from '@mui/material';
// auth
import AuthGuard from 'hocs/auth/AuthGuard';
import GuestGuard from 'hocs/auth/GuestGuard';
// layouts
import CompactLayout from 'layouts/compact/index';
import DashboardLayout from 'layouts/dashboard';
// config
//
import {
  Page404,
  Overview,
  Login,
  Register,
  NewRestaurantYourApplication,
  NewRestaurantGetStarted,
  NewRestaurantCompanyInfo,
  NewRestaurantCreateRestaurant,
  NewRestaurantAddLocations,
  PageConfirmEmail,
  DealsCreate,
  DealsAll,
  DealsSingle,
  DealsEdit,
  Restaurant,
  RestaurantEdit,
  LocationsAll,
  LocationsAdd,
  LocationEdit,
  ChangePassword,
  ForgotPassword,
  Subscription
} from './elements';
import { PATH_AUTH, PATH_MISC, PATH_NEW_RESTAURANT } from './paths';
import { usePathAfterLogin } from 'hooks/usePathAfterLogin';
import NewRestaurantLayout from 'layouts/new-restaurant/NewRestaurantLayout';
import Test from 'pages/misc/Test';

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
              <Login />
            </GuestGuard>
          )
        },
        {
          path: PATH_AUTH.register,
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          )
        },
        {
          path: PATH_AUTH.change_password,
          element: <ChangePassword />
        },
        {
          path: PATH_AUTH.forgot_password,
          element: (
            <GuestGuard>
              <ForgotPassword />
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
        {
          path: 'deals',
          children: [
            {
              element: <Navigate to={'/dashboard/deals/active'} replace />,
              index: true
            },
            { path: 'active', element: <DealsAll /> },
            { path: 'expired', element: <DealsAll /> },
            { path: 'create', element: <DealsCreate /> },
            { path: 'single/:id', element: <DealsSingle /> },
            { path: 'edit/:id', element: <DealsEdit /> }
          ]
        },
        {
          path: 'restaurant',
          children: [
            {
              element: <Restaurant />,
              index: true
            },
            { path: 'edit', element: <RestaurantEdit /> }
          ]
        },
        {
          path: 'locations',
          children: [
            {
              element: <LocationsAll />,
              index: true
            },
            { path: 'add', element: <LocationsAdd /> },
            { path: 'edit/:id', element: <LocationEdit /> }
          ]
        },
        { path: 'users', element: <Test /> },
        { path: 'subscription', element: <Subscription /> }
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
    {
      element: <CompactLayout />,
      children: [
        { path: PATH_MISC.four0four, element: <Page404 /> },
        { path: PATH_MISC.confirm_email, element: <PageConfirmEmail /> },
        { path: 'test', element: <Test /> }
      ]
    },
    {
      path: '/test',
      element: (
        <CompactLayout>
          <Test />
        </CompactLayout>
      )
    },
    { path: '*', element: <Navigate to={PATH_MISC.four0four} replace /> }
  ]);
}
