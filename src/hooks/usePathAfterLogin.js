import { RESTAURANT_STATUS } from '../constants/restaurants.constants';
import { PATH_DASHBOARD, PATH_NEW_RESTAURANT } from '../routes/paths';
import { useAuthContext } from './useAuthContext';

export const usePathAfterLogin = () => {
  const { initialRestuarantStatus } = useAuthContext();

  let pathAfterLogin;

  switch (initialRestuarantStatus) {
    case undefined:
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
