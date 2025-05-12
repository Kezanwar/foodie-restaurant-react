import axios from 'axios';
// config
import { HOST_API_KEY } from '../config';
import { setSession } from 'hocs/auth/utils';
import { PATH_MISC } from 'routes/paths';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API_KEY });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    switch (error.response.status) {
      case 499:
        /*expired token*/
        setSession(null);
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
