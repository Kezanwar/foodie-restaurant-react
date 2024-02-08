import PropTypes from 'prop-types';
import { useQueryClient } from 'react-query';

import {
  createContext,
  useEffect,
  useReducer,
  useCallback,
  useMemo
} from 'react';

// utils
import axios from 'utils/axios';
import { setSession } from './utils';
import { MIXPANEL_EVENTS, mixpanelTrack } from 'utils/mixpanel';

// config
import { AUTH_ENDPOINTS } from '../constants/auth.constants';

const ACTION_TYPES = {
  INITIALIZE: 'INITIALIZE',
  REGISTER: 'REGISTER',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT'
};

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null
};

const reducer = (state, action) => {
  if (!action.type) throw new Error('auth reducer action must have a type');
  switch (action.type) {
    case ACTION_TYPES.INITIALIZE:
      return {
        isInitialized: true,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user
      };
    case ACTION_TYPES.LOGIN:
    case ACTION_TYPES.REGISTER:
      return {
        isInitialized: true,
        isAuthenticated: true,
        user: action.payload.user
      };
    case ACTION_TYPES.LOGOUT:
      return {
        isInitialized: true,
        isAuthenticated: false,
        user: null
      };
    default:
      return state;
  }
};

// ----------------------------------------------------------------------

export const AuthContext = createContext(null);

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const queryClient = useQueryClient();
  const initialize = useCallback(async () => {
    try {
      const accessToken =
        typeof window !== 'undefined'
          ? localStorage.getItem('accessToken')
          : '';

      if (accessToken) {
        setSession(accessToken);

        const response = await axios.get(AUTH_ENDPOINTS.intialize);

        const { user } = response.data;

        dispatch({
          type: ACTION_TYPES.INITIALIZE,
          payload: {
            isAuthenticated: !!user,
            user
          }
        });
      } else {
        dispatch({
          type: ACTION_TYPES.INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: ACTION_TYPES.INITIALIZE,
        payload: {
          isAuthenticated: false,
          user: null
        }
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email, password) => {
    const response = await axios.post(AUTH_ENDPOINTS.login, {
      email,
      password
    });
    const { accessToken, user } = response.data;

    setSession(accessToken);

    dispatch({
      type: 'LOGIN',
      payload: {
        user
      }
    });
  }, []);

  // LOGIN WITH GOOGLE

  const loginWithGoogle = useCallback(async (token) => {
    const response = await axios.post(AUTH_ENDPOINTS.loginWithGoogle, {
      token
    });
    const { accessToken, user } = response.data;

    setSession(accessToken);

    dispatch({
      type: 'LOGIN',
      payload: {
        user
      }
    });
  }, []);

  // REGISTER WITH GOOGLE
  const registerWithGoogle = useCallback(async (token) => {
    const response = await axios.post(AUTH_ENDPOINTS.registerWithGoogle, {
      token
    });
    const { accessToken, user } = response.data;

    setSession(accessToken);

    dispatch({
      type: 'REGISTER',
      payload: {
        user
      }
    });
  }, []);

  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName) => {
    const response = await axios.post(AUTH_ENDPOINTS.register, {
      email,
      password,
      first_name: firstName,
      last_name: lastName
    });
    const { accessToken, user } = response.data;

    setSession(accessToken);

    dispatch({
      type: 'REGISTER',
      payload: {
        user
      }
    });
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    queryClient.clear();
    mixpanelTrack(MIXPANEL_EVENTS.logout_success, { user: state.user });
    dispatch({
      type: 'LOGOUT'
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.user?.first_name]);

  const values = useMemo(() => {
    return {
      ...state,
      userRole: state?.user?.restaurant?.role,
      emailConfirmed: state?.user?.email_confirmed,
      login,
      initialize,
      loginWithGoogle,
      logout,
      register,
      registerWithGoogle
    };
  }, [
    state,
    login,
    logout,
    register,
    registerWithGoogle,
    loginWithGoogle,
    initialize
  ]);

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
