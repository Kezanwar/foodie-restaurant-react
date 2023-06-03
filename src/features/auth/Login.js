// @mui
import { Alert, Stack, Typography, Link, Select, Menu } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
// layouts
import AuthLayout from '../../layouts/auth';
// sections
import AuthLoginForm from './AuthLoginForm';
// components
import RouterLink from '../../components/router-link/RouterLink';

import { PATH_AUTH } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function Login() {
  return (
    <AuthLayout>
      <Stack spacing={2} sx={{ mb: 2, position: 'relative' }}>
        <Typography variant="h3">Sign in to your Partner Dashboard</Typography>

        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Typography variant="body2">New user?</Typography>

          <RouterLink to={PATH_AUTH.register}>
            <Link variant="subtitle2">Create an account</Link>
          </RouterLink>
        </Stack>
      </Stack>

      <Alert icon={<HelpIcon />} severity="success" sx={{ mb: 5 }}>
        Not a restaurant? <strong>Download our customer app</strong>
      </Alert>

      <AuthLoginForm />
    </AuthLayout>
  );
}
