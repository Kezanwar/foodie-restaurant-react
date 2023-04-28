import { RESTAURANT_STATUS } from '../constants/restaurants.constants';
import {
  PATH_AUTH,
  PATH_DASHBOARD,
  PATH_NEW_RESTAURANT
} from '../routes/paths';
import { useAuthContext } from './useAuthContext';

export const usePathAfterLogin = () => {
  const { isAuthenticated, initialRestuarantStatus } = useAuthContext();

  let pathAfterLogin;

  switch (initialRestuarantStatus) {
    case undefined:
      pathAfterLogin = isAuthenticated
        ? PATH_NEW_RESTAURANT.new_restaurant
        : PATH_AUTH.login;
      break;
    case RESTAURANT_STATUS.APPLICATION_PENDING:
    case RESTAURANT_STATUS.APPLICATION_PROCESSING:
      pathAfterLogin = PATH_NEW_RESTAURANT.new_restaurant;
      break;
    case RESTAURANT_STATUS.APPLICATION_ACCEPTED:
    case RESTAURANT_STATUS.LIVE:
    case RESTAURANT_STATUS.DISABLED:
      pathAfterLogin = PATH_DASHBOARD.overview;
      break;
    default:
      pathAfterLogin = PATH_DASHBOARD.overview;
      break;
  }
  return pathAfterLogin;
};
