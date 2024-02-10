import axios from 'utils/axios';

// ----------------------------------------------------------------------

export const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    axios.defaults.headers['x-auth-token'] = accessToken;
  } else {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers['x-auth-token'];
  }
};
