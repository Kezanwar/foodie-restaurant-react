import { PATH_AUTH, PATH_DASHBOARD, PATH_NEW_RESTAURANT } from 'routes/paths';
import { useAuthContext } from './useAuthContext';
import Permissions from 'utils/permissions';

export const usePathAfterLogin = () => {
  const { isAuthenticated, initialRestuarantStatus } = useAuthContext();

  let pathAfterLogin;

  if (!isAuthenticated) {
    pathAfterLogin = PATH_AUTH.login;
  }

  if (Permissions.isApplicationPending(initialRestuarantStatus)) {
    pathAfterLogin = PATH_NEW_RESTAURANT.new_restaurant;
  } else {
    pathAfterLogin = PATH_DASHBOARD.overview;
  }

  return pathAfterLogin;
};
