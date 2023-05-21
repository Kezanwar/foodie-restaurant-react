import React, { useEffect, useMemo, useRef } from 'react';
import { mixpanelTrack } from '../utils/mixpanel';
import { useAuthContext } from './useAuthContext';

const useRHFErrorMixpanelTracker = (evName, errors) => {
  const { user } = useAuthContext();

  const errorsArr = useMemo(() => {
    if (!errors) return [];
    return Object.entries(errors);
  }, [errors]);

  useEffect(() => {
    if (!evName) return;
    if (!errorsArr?.length) return;
    const data = errorsArr.reduce((current, [name, err]) => {
      return { ...current, [name]: err.message };
    }, {});
    if (user?.email) {
      data.auth = user;
    }
    mixpanelTrack(evName, { errors: data });
  }, [errorsArr, evName, user?.email]);

  return null;
};

export default useRHFErrorMixpanelTracker;
