import { Suspense, lazy } from 'react';
// components
import LoadingScreen from 'components/loading-screen/LoadingScreen';
// ----------------------------------------------------------------------

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

// ----------------------------------------------------------------------

// * Guest Pages

export const Login = Loadable(lazy(() => import('pages/guest/Login')));

export const Register = Loadable(lazy(() => import('pages/guest/Register')));

export const ChangePassword = Loadable(
  lazy(() => import('pages/misc/ChangePassword'))
);

// ----------------------------------------------------------------------

// * Dashboard Overview

export const Overview = Loadable(
  lazy(() => import('pages/dashboard/Overview'))
);

// ---------------

// * Dashboard Deals

export const DealsAll = Loadable(
  lazy(() => import('pages/dashboard/Deals/DealsAll'))
);

export const DealsCreate = Loadable(
  lazy(() => import('pages/dashboard/Deals/DealsCreate'))
);

export const DealsSingle = Loadable(
  lazy(() => import('pages/dashboard/Deals/DealsSingle'))
);
export const DealsEdit = Loadable(
  lazy(() => import('pages/dashboard/Deals/DealsEdit'))
);

// * Dashboard Restaurant

export const Restaurant = Loadable(
  lazy(() => import('pages/dashboard/Restaurant/Restaurant'))
);

export const RestaurantEdit = Loadable(
  lazy(() => import('pages/dashboard/Restaurant/RestaurantEdit'))
);

// * Dashboard Locations

export const LocationsAll = Loadable(
  lazy(() => import('pages/dashboard/Locations/LocationsAll'))
);

export const LocationsAdd = Loadable(
  lazy(() => import('pages/dashboard/Locations/LocationsAdd'))
);

export const LocationEdit = Loadable(
  lazy(() => import('pages/dashboard/Locations/LocationEdit'))
);

// ----------------------------------------------------------------------

// * New Restaurant Pages

// export const NewRestaurantPage = Loadable(lazy(() => import('pages/new-restaurant/NewRestaurant')));

export const NewRestaurantGetStarted = Loadable(
  lazy(() => import('pages/new-restaurant/NewRestaurantGetStarted'))
);
export const NewRestaurantCompanyInfo = Loadable(
  lazy(() => import('pages/new-restaurant/NewRestaurantCompanyInfo'))
);

export const NewRestaurantCreateRestaurant = Loadable(
  lazy(() => import('pages/new-restaurant/NewRestaurantCreateRestaurant'))
);

export const NewRestaurantAddLocations = Loadable(
  lazy(() => import('pages/new-restaurant/NewRestaurantAddLocations'))
);
export const NewRestaurantYourApplication = Loadable(
  lazy(() => import('pages/new-restaurant/NewRestaurantYourApplication'))
);

// ----------------------------------------------------------------------

// * Miscellaneous pages

export const Page404 = Loadable(lazy(() => import('pages/misc/404')));

export const PageConfirmEmail = Loadable(
  lazy(() => import('pages/misc/ConfirmEmail'))
);
