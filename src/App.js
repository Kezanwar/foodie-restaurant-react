//    ___                __ __
//  .'  _.-----.-----.--|  |__.-----.
//  |   _|  _  |  _  |  _  |  |  -__|
//  |__| |_____|_____|_____|__|_____|

import mixpanel from 'mixpanel-browser';
import { QueryClientProvider } from '@tanstack/react-query';

import { GoogleOAuthProvider } from '@react-oauth/google';

// routes
import Router from './routes';

// providers

import ThemeProvider from 'theme/index';
import SnackbarProvider from 'components/snackbar/SnackbarProvider';
import UtilityProvider from 'hocs/utility/UtilityContext';

// components
import { MotionLazyContainer } from 'components/animate';

// config
import { ENVIRONMENT, GOOGLE_CLIENT_ID, MIXPANEL_API_KEY } from './config';
import queryClient from 'lib/query-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AuthInitializer from 'hocs/auth/AuthInitializer';

// ----------------------------------------------------------------------

mixpanel.init(MIXPANEL_API_KEY, { debug: ENVIRONMENT === 'DEVELOPMENT' });

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        {ENVIRONMENT === 'DEVELOPMENT' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
        <AuthInitializer>
          <UtilityProvider>
            <MotionLazyContainer>
              <ThemeProvider>
                <SnackbarProvider>
                  <Router />
                </SnackbarProvider>
              </ThemeProvider>
            </MotionLazyContainer>
          </UtilityProvider>
        </AuthInitializer>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
