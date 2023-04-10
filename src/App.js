import mixpanel from 'mixpanel-browser';
import { QueryClient, QueryClientProvider } from 'react-query';

// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// locales
import ThemeLocalization from './locales';
// components
import SnackbarProvider from './components/snackbar';
import { ThemeSettings } from './components/settings';
import { MotionLazyContainer } from './components/animate';
import { AuthProvider } from './auth/AuthContext';
import UtilityProvider from './context/utility/UtilityContext';

// ----------------------------------------------------------------------

export default function App() {
  mixpanel.init(process.env.MIXPANEL_TOKEN, { debug: true });
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <UtilityProvider>
        <MotionLazyContainer>
          <ThemeProvider>
            <ThemeSettings>
              <ThemeLocalization>
                <SnackbarProvider>
                  <Router />
                </SnackbarProvider>
              </ThemeLocalization>
            </ThemeSettings>
          </ThemeProvider>
        </MotionLazyContainer>
      </UtilityProvider>
    </QueryClientProvider>
  );
}
