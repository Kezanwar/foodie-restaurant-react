import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { MIXPANEL_EVENTS, mixpanelTrack } from 'lib/mixpanel';
import { endSession, setSession } from 'lib/axios';
import queryClient from 'lib/query-client';
import {
  initialize,
  login,
  loginWithGoogle,
  register,
  registerWithGoogle
} from 'lib/api';

const useAuthStore = create(
  devtools((set, get) => ({
    isInitialized: false,
    isAuthenticated: false,
    user: null,

    initialize: async () => {
      try {
        const accessToken =
          typeof window !== 'undefined'
            ? localStorage.getItem('accessToken')
            : '';

        if (accessToken) {
          setSession(accessToken);
          const res = await initialize();
          const user = res.data.user;

          set({
            isInitialized: true,
            isAuthenticated: !!user,
            user
          });
        } else {
          console.log('runs');
          set({ isInitialized: true, isAuthenticated: false, user: null });
        }
      } catch (err) {
        console.error(err);
        set({ isInitialized: true, isAuthenticated: false, user: null });
      }
    },

    login: async (email, password) => {
      const res = await login(email, password);
      const { accessToken, user } = res.data;

      setSession(accessToken);
      set({ isAuthenticated: true, user });
    },

    loginWithGoogle: async (token) => {
      const res = await loginWithGoogle(token);
      const { accessToken, user } = res.data;

      setSession(accessToken);
      set({ isAuthenticated: true, user });
    },

    registerWithGoogle: async (token) => {
      const res = await registerWithGoogle(token);
      const { accessToken, user } = res.data;

      setSession(accessToken);
      set({ isAuthenticated: true, user });
    },

    register: async (email, password, firstName, lastName) => {
      const res = await register(email, password, firstName, lastName);
      const { accessToken, user } = res.data;

      setSession(accessToken);
      set({ isAuthenticated: true, user });
    },

    logout: async () => {
      const { user } = get();
      endSession(null);
      queryClient.clear();
      mixpanelTrack(MIXPANEL_EVENTS.logout_success, { user });
      set({ isAuthenticated: false, user: null });
    }
  }))
);

export default useAuthStore;
