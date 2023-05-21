import React, { useEffect, useMemo, useRef } from 'react';
import { useSnackbar } from 'notistack';
import { mixpanelTrack } from '../utils/mixpanel';
import { useAuthContext } from './useAuthContext';

const useRHFErrorMixpanelTracker = (evName, errors) => {
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const errArr = Object.entries(errors);
  errArr.forEach(([name, value]) =>
    enqueueSnackbar(value.message, { variant: 'error' })
  );

  const data = { ...errors };
  if (user?.email) {
    data.auth = user;
  }
  mixpanelTrack(evName, { errors: data });

  return null;
};

export default useRHFErrorMixpanelTracker;
