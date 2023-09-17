import { useEffect, useState } from 'react';
import axios from 'axios';
import { differenceInCalendarDays, parseISO } from 'date-fns';

import { ENVIRONMENT, IP_KEY, RAPID_KEY } from '../config';

const DEV = ENVIRONMENT === 'DEVELOPMENT';

const DIFF = 14;

const STORAGE_KEY = 'foodie/client';

const fetchClientLocation = () => {
  return axios.get(
    'https://find-any-ip-address-or-domain-location-world-wide.p.rapidapi.com/iplocation',
    {
      params: {
        apikey: IP_KEY
      },
      headers: {
        'X-RapidAPI-Key': RAPID_KEY,
        'X-RapidAPI-Host':
          'find-any-ip-address-or-domain-location-world-wide.p.rapidapi.com'
      }
    }
  );
};

const getClientLocationFromLocalStorage = () => {
  const ls_item = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
  return ls_item;
};

const saveClientLocationToLocalStorage = (new_item) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(new_item));
};

const useClientLocation = () => {
  const now = new Date();

  const current = getClientLocationFromLocalStorage() || {};

  const { l, t } = current;

  const [clientLocation, setClientLocation] = useState(
    DEV ? 'United Kingdom' : l
  );

  useEffect(() => {
    if (differenceInCalendarDays(now, t ? parseISO(t) : now) > DIFF || !l) {
      if (!DEV) {
        fetchClientLocation()
          .then((res) => {
            if (res?.data?.country) {
              setClientLocation(res.data.country || '');
              saveClientLocationToLocalStorage({
                l: res.data.country,
                t: now
              });
            }
          })
          .catch((err) => {});
      }
    }
  }, []);

  return clientLocation;
};

export default useClientLocation;
