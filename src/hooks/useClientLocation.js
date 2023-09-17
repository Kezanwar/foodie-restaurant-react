import { useEffect, useState } from 'react';
import axios from 'axios';

const R_KEY = process.env.REACT_APP_RAPID_KEY;
const IP_KEY = process.env.REACT_APP_IP_FIND_KEY;

const fetchClientLocation = () => {
  return axios.get(
    'https://find-any-ip-address-or-domain-location-world-wide.p.rapidapi.com/iplocation',
    {
      params: {
        apikey: IP_KEY
      },
      headers: {
        'X-RapidAPI-Key': R_KEY,
        'X-RapidAPI-Host':
          'find-any-ip-address-or-domain-location-world-wide.p.rapidapi.com'
      }
    }
  );
};

const useClientLocation = () => {
  const [clientLocation, setClientLocation] = useState('');

  useEffect(() => {
    fetchClientLocation()
      .then((res) => setClientLocation(res?.data?.country || ''))
      .catch((err) => {});
  }, []);

  return clientLocation;
};

export default useClientLocation;
