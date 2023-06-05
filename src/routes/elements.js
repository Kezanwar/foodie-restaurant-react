import { Suspense, lazy } from 'react';
// components
import LoadingScreen from '../components/loading-screen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

// ----------------------------------------------------------------------

// * Guest Pages

export const LoginPage = Loadable(
  lazy(() => import('../pages/guest/LoginPage'))
);
export const RegisterPage = Loadable(
  lazy(() => import('../pages/guest/RegisterPage'))
);

// ----------------------------------------------------------------------

// * Dashboard Pages

export const Overview = Loadable(
  lazy(() => import('../pages/dashboard/Overview'))
);
export const PageTwo = Loadable(
  lazy(() => import('../pages/dashboard/PageTwo'))
);
export const PageThree = Loadable(
  lazy(() => import('../pages/dashboard/PageThree'))
);
export const PageFour = Loadable(
  lazy(() => import('../pages/dashboard/PageFour'))
);
export const PageFive = Loadable(
  lazy(() => import('../pages/dashboard/PageFive'))
);
export const PageSix = Loadable(
  lazy(() => import('../pages/dashboard/PageSix'))
);

// * Dashboard Deals

export const DealsCreate = Loadable(
  lazy(() => import('../pages/dashboard/Deals/DealsCreate'))
);

// ----------------------------------------------------------------------

// * New Restaurant Pages

// export const NewRestaurantPage = Loadable(lazy(() => import('../pages/new-restaurant/NewRestaurant')));

export const NewRestaurantGetStarted = Loadable(
  lazy(() => import('../pages/new-restaurant/NewRestaurantGetStarted'))
);
export const NewRestaurantCompanyInfo = Loadable(
  lazy(() => import('../pages/new-restaurant/NewRestaurantCompanyInfo'))
);

export const NewRestaurantCreateRestaurant = Loadable(
  lazy(() => import('../pages/new-restaurant/NewRestaurantCreateRestaurant'))
);

export const NewRestaurantAddLocations = Loadable(
  lazy(() => import('../pages/new-restaurant/NewRestaurantAddLocations'))
);
export const NewRestaurantYourApplication = Loadable(
  lazy(() => import('../pages/new-restaurant/NewRestaurantYourApplication'))
);

// ----------------------------------------------------------------------

// * Miscellaneous pages

export const Page404 = Loadable(lazy(() => import('../pages/misc/Page404')));

export const PageConfirmEmail = Loadable(
  lazy(() => import('../pages/misc/PageConfirmEmail'))
);
