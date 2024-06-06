import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { PATH_NEW_RESTAURANT } from 'routes/paths';
import Permissions from 'utils/permissions';

// eslint-disable-next-line consistent-return
const useCreateRestaurantGuard = () => {
  const navigate = useNavigate();

  const guard = useCallback((restaurant, currentStep) => {
    const status = restaurant?.status;
    const regStep = restaurant?.registration_step;
    if (restaurant) {
      if (!regStep && currentStep !== PATH_NEW_RESTAURANT.step_1) {
        return navigate(PATH_NEW_RESTAURANT.step_1);
      }

      if (Permissions.isApplicationProcessing(status)) {
        return navigate(PATH_NEW_RESTAURANT.new_restaurant);
      }

      if (Permissions.isApplicationPending(status)) {
        if (regStep && !Permissions.canAccessRoute(currentStep, regStep)) {
          return navigate(Permissions.getRegStepRedirect(regStep));
        }
      }

      if (Permissions.isApplicationRejected(status)) {
        return navigate(PATH_NEW_RESTAURANT.new_restaurant);
      }
    }
  }, []);

  return guard;
};

export default useCreateRestaurantGuard;
