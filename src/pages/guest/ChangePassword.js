import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Helmet } from 'react-helmet-async';
import {
  Box,
  Stack,
  Typography,
  IconButton,
  InputAdornment
} from '@mui/material';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Iconify from 'components/iconify';
import FormProvider, { RHFTextField } from 'components/hook-form';

import { useAuthContext } from 'hooks/useAuthContext';
import AuthLayout from 'layouts/auth/AuthLayout';

import { ChangePasswordSchema } from 'validation/auth';
import { useSnackbar } from 'notistack';
import { useSearchParams } from 'react-router-dom';
import { format, isPast } from 'date-fns';
import BlackLoadingButton from 'components/black-loading-button/BlackLoadingButton';
import CustomTooltip from 'components/custom-tooltip/CustomTooltip';
import { auth_tooltips } from 'constants/tooltips';
import { changePassword } from 'utils/api';

const PageChangePassword = () => {
  const { logout, isAuthenticated } = useAuthContext();

  useEffect(() => {
    if (isAuthenticated) logout();
  }, [isAuthenticated, logout]);

  const { enqueueSnackbar } = useSnackbar();

  const [searchParams] = useSearchParams();

  const params = useMemo(() => {
    const t = searchParams.get('token');
    const e = searchParams.get('expires');

    if (!t || !e) return null;

    return {
      token: t,
      expires: e
    };
  }, [searchParams]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const defaultValues = {
    password: '',
    confirm_password: ''
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(ChangePasswordSchema),
    defaultValues
  });

  const {
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful }
  } = methods;

  const onError = useCallback(
    (errors) => {
      const errArr = Object.entries(errors);
      errArr.forEach(([, value]) =>
        value?.message
          ? enqueueSnackbar(value.message, { variant: 'error' })
          : null
      );
    },
    [enqueueSnackbar]
  );

  const expireDate = params ? new Date(params.expires) : null;

  const isExpired =
    !params ||
    params.token === 'expired' ||
    !expireDate ||
    isPast(expireDate) ||
    !!errors.afterSubmit;

  const onSubmit = useCallback(
    async (data) => {
      try {
        setLoading(true);
        await changePassword(params.token, data.password);
        setSuccess(true);
      } catch (error) {
        setError('afterSubmit', {
          ...error,
          message: 'Link expired!'
        });
      } finally {
        setLoading(false);
      }
    },
    [params, setError]
  );

  return (
    <>
      <Helmet>
        <title> Change Password | Foodie</title>
      </Helmet>

      <AuthLayout>
        {isExpired ? (
          <TokenExpired />
        ) : success ? (
          <Success />
        ) : (
          <>
            <Box textAlign={'center'} mb={4}>
              <Typography variant="h3">Change your password</Typography>

              <Stack
                direction="column"
                alignItems="center"
                justifyContent={'center'}
                mt={2}
                spacing={1}
              >
                <Typography color={'text.secondary'} variant="body2">
                  Please choose a new password. Remember to choose a strong,
                  unique password to safeguard your account. Thank you for
                  helping us maintain the security of your account.
                </Typography>
                <Typography color={'text.secondary'} variant="body2">
                  This link will expire at{' '}
                  <Typography
                    variant="body2"
                    component={'span'}
                    color={'primary.main'}
                  >
                    {format(expireDate, 'hh:mm bbbb')}
                  </Typography>
                  <Typography variant="body2" component={'span'}>
                    {' '}
                    on{' '}
                  </Typography>
                  <Typography
                    variant="body2"
                    component={'span'}
                    color={'primary.main'}
                  >
                    {format(expireDate, 'dd/MM/yyyy')}
                  </Typography>
                </Typography>
              </Stack>
            </Box>
            <FormProvider
              methods={methods}
              onSubmit={handleSubmit(onSubmit, onError)}
            >
              <Stack gap={3}>
                <CustomTooltip
                  tooltipText={auth_tooltips.password_requirements.tooltip}
                />
                <RHFTextField
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          <Iconify
                            icon={
                              showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                <RHFTextField
                  name="confirm_password"
                  label="Confirm password"
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          <Iconify
                            icon={
                              showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <BlackLoadingButton
                  loading={loading}
                  type="submit"
                  variant="contained"
                >
                  Done
                </BlackLoadingButton>
              </Stack>
            </FormProvider>
          </>
        )}
      </AuthLayout>
    </>
  );
};

export default PageChangePassword;

const TokenExpired = () => {
  return (
    <Box textAlign={'center'}>
      <Typography mb={4} variant="h3">
        🙁 Sorry this link has expired...
      </Typography>
      <Typography color={'text.secondary'} variant="body2">
        For security reasons, this link has expired. Please initiate the
        password reset process again to regain access to your account.
      </Typography>
    </Box>
  );
};

const Success = () => {
  return (
    <Box textAlign={'center'}>
      <Typography mb={4} variant="h3">
        🚀 Success!
      </Typography>
      <Typography color={'text.secondary'} variant="body2">
        Thanks, your password has been updated! Please try and log in again.
      </Typography>
    </Box>
  );
};
