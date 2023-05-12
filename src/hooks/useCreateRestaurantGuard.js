import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';

import { PATH_NEW_RESTAURANT } from '../routes/paths';
import {
  RESTAURANT_REG_STEPS,
  RESTAURANT_STATUS
} from '../constants/restaurants.constants';

const pathsArr = Object.values(PATH_NEW_RESTAURANT).filter(
  (path) => path !== PATH_NEW_RESTAURANT.new_restaurant
);

const regStepsArr = Object.values(RESTAURANT_REG_STEPS);

// eslint-disable-next-line consistent-return
const useCreateRestaurantGuard = (restaurant, currentStep) => {
  const restStatus = restaurant?.status;
  const restRegStep = restaurant?.registration_step;
  const navigate = useNavigate();

  if (restaurant) {
    if (!restRegStep && currentStep !== PATH_NEW_RESTAURANT.step_1) {
      return navigate(PATH_NEW_RESTAURANT.step_1);
    }

    if (restStatus === RESTAURANT_STATUS.APPLICATION_PROCESSING) {
      return navigate(PATH_NEW_RESTAURANT.new_restaurant);
    }

    if (restStatus === RESTAURANT_STATUS.APPLICATION_PENDING) {
      const R_STEP = restRegStep.split('COMPLETE')[0].slice(0, -1);
      const R_STEP_INDEX = regStepsArr.findIndex((s) => s === R_STEP);
      const CURRENT_PATH_INDEX = pathsArr.findIndex(
        (path) => path === currentStep
      );

      if (R_STEP_INDEX < CURRENT_PATH_INDEX - 1) {
        return navigate(pathsArr[R_STEP_INDEX + 1]);
      }
    }

    if (restStatus === RESTAURANT_STATUS.APPLICATION_REJECTED) {
      return navigate(PATH_NEW_RESTAURANT.new_restaurant);
    }
  }
};

export default useCreateRestaurantGuard;
