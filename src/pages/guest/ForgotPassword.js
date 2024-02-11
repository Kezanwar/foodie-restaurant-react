import React, { useCallback, useState } from 'react';

import { Helmet } from 'react-helmet-async';
import { Box, Stack, Typography, Alert } from '@mui/material';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import FormProvider, { RHFTextField } from 'components/hook-form';
import BlackLoadingButton from 'components/black-loading-button/BlackLoadingButton';

import AuthLayout from 'layouts/auth/AuthLayout';

import { ForgotPasswordSchema } from 'validation/auth';
import { useSnackbar } from 'notistack';
import { forgotPassword } from 'utils/api';

const ForgotPassword = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const defaultValues = {
    password: '',
    confirm_password: ''
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues
  });

  const {
    handleSubmit,
    setError,
    formState: { errors }
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

  const onSubmit = useCallback(
    async (data) => {
      try {
        setLoading(true);
        await forgotPassword(data.email);
        enqueueSnackbar(`Email sent to ${data.email}`);
        setSuccess(true);
      } catch (error) {
        setError('afterSubmit', {
          ...error,
          message: error?.message || 'An unexpcted error occured.'
        });
      } finally {
        setLoading(false);
      }
    },
    [setError, enqueueSnackbar]
  );

  return (
    <>
      <Helmet>
        <title> Forgot Password | Foodie</title>
      </Helmet>

      <AuthLayout>
        {success ? (
          <Success />
        ) : (
          <>
            <Box textAlign={'center'} mb={4}>
              <Typography variant="h3">Forgot your password?</Typography>

              <Stack
                direction="column"
                alignItems="center"
                justifyContent={'center'}
                mt={2}
                spacing={1}
              >
                <Typography color={'text.secondary'} variant="body2">
                  Oops, can't seem to recall your password? No worries, we've
                  got you covered! Simply enter your email address associated
                  with your account, and we'll send you a link to reset your
                  password.
                </Typography>
              </Stack>
            </Box>
            <FormProvider
              methods={methods}
              onSubmit={handleSubmit(onSubmit, onError)}
            >
              <Stack gap={3}>
                <RHFTextField
                  name="email"
                  label="Email Address"
                  type={'text'}
                />
                {!!errors.afterSubmit && (
                  <Alert severity="error">{errors.afterSubmit.message}</Alert>
                )}
                <BlackLoadingButton
                  loading={loading}
                  type="submit"
                  variant="contained"
                >
                  Submit
                </BlackLoadingButton>
              </Stack>
            </FormProvider>
          </>
        )}
      </AuthLayout>
    </>
  );
};

export default ForgotPassword;

const Success = ({ email }) => {
  return (
    <Box textAlign={'center'}>
      <Typography mb={4} variant="h3">
        🚀 Success!
      </Typography>
      <Typography color={'text.secondary'} variant="body2">
        Thanks, an email has been sent to you with a reset password link.
      </Typography>
    </Box>
  );
};
