// config
import axios from 'axios';
import { HOST_API_KEY } from '../config';

import { PATH_MISC } from 'routes/paths';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API_KEY });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    switch (error.response.status) {
      case 499:
        /*expired token*/
        endSession();
        window.location.reload();
        break;
      case 599:
        /*maintenance mode*/
        if (window.location.pathname !== PATH_MISC.maintenance_mode) {
          window.location.href = `${window.location.origin}${PATH_MISC.maintenance_mode}`;
        }
        break;
      default:
        return Promise.reject(
          (error.response && error.response.data) || 'Something went wrong'
        );
    }
  }
);

export default axiosInstance;

export const setSession = (accessToken) => {
  localStorage.setItem('accessToken', accessToken);
  axiosInstance.defaults.headers['x-auth-token'] = accessToken;
};

export const endSession = () => {
  localStorage.removeItem('accessToken');
  delete axiosInstance.defaults.headers['x-auth-token'];
};
