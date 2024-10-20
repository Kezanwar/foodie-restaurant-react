import axios from 'axios';
// config
import { HOST_API_KEY } from '../config';
import { setSession } from 'hocs/auth/utils';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API_KEY });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    switch (error.response.status) {
      case 511:
        setSession(null);
        window.location.reload();
        break;
      default:
        return Promise.reject(
          (error.response && error.response.data) || 'Something went wrong'
        );
    }
  }
);

export default axiosInstance;
