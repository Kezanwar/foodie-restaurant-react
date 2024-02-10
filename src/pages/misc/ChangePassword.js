import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { Helmet } from 'react-helmet-async';
import { Box, Link, Stack, Typography } from '@mui/material';

import useCustomMediaQueries from 'hooks/useCustomMediaQueries';
import { useAuthContext } from 'hooks/useAuthContext';
import AuthLayout from 'layouts/auth/AuthLayout';
import RouterLink from 'components/router-link/RouterLink';

import { PATH_AUTH } from 'routes/paths';

const PageChangePassword = () => {
  const { logout } = useAuthContext();

  useEffect(() => {
    logout();
  }, []);

  // const navigate = useNavigate();

  // const [OTP, setOTP] = useState('');
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState('');

  return (
    <>
      <Helmet>
        <title> Change Password | Foodie</title>
      </Helmet>

      <AuthLayout>
        <Stack spacing={2} sx={{ mb: 2, position: 'relative' }}>
          <Typography variant="h3">
            Sign in to your Partner Dashboard
          </Typography>

          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="body2">New user?</Typography>

            <RouterLink to={PATH_AUTH.register}>
              <Link variant="subtitle2">Create an account</Link>
            </RouterLink>
          </Stack>
        </Stack>
      </AuthLayout>
    </>
  );
};

export default PageChangePassword;
