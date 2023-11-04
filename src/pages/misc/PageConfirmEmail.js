import React, { useEffect, useState } from 'react';

import { MuiOtpInput } from 'mui-one-time-password-input';
import {
  Alert,
  Box,
  CircularProgress,
  Typography,
  styled
} from '@mui/material';
import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { LoadingButton } from '@mui/lab';

import Image from 'mui-image';

import { useAuthContext } from '../../hooks/useAuthContext';
import Spacer from '../../components/spacer/Spacer';
import UndrawSVG from '../../assets/undraw-completing.svg';
import useCustomMediaQueries from '../../hooks/useCustomMediaQueries';
import { usePathAfterLogin } from '../../hooks/usePathAfterLogin';
import axiosInstance from '../../utils/axios';
import { AUTH_ENDPOINTS } from '../../constants/auth.constants';

export const LoadingBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center'
}));

const PageConfirmEmail = (props) => {
  const { user, emailConfirmed, initialize } = useAuthContext();
  const { isTablet, isMobile } = useCustomMediaQueries();
  const pathAfterLogin = usePathAfterLogin();
  const navigate = useNavigate();

  const [OTP, setOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (emailConfirmed) {
      navigate(pathAfterLogin);
    }
  }, [emailConfirmed, navigate, pathAfterLogin]);

  const onChange = (v) => {
    setError('');
    setOTP(v);
  };

  const onComplete = async (v) => {
    try {
      await axiosInstance.post(`${AUTH_ENDPOINTS.confirmEmailOTP}/${v}`);
      initialize();
    } catch (error) {
      setError(error?.message || 'An unexpected error occured');
    }
  };

  const onResend = async () => {
    try {
      await axiosInstance.patch(AUTH_ENDPOINTS.resendEmailOTP);
    } catch (error) {
      setError(error?.message || 'An unexpected error occured');
    }
  };

  return (
    <>
      <Helmet>
        <title> Confirm email | Foodie</title>
      </Helmet>

      <Box textAlign={isTablet ? 'center' : 'left'}>
        {!isMobile && <Spacer />}
        <Box
          display={'flex'}
          sx={{ flexDirection: isTablet ? 'column-reverse' : 'row' }}
        >
          <Box flex={1} mr={isTablet ? 0 : 8} mt={isTablet ? 4 : 0}>
            <Typography variant="h3">
              Confirm your{' '}
              <Typography display={'inline'} variant="span" color={'primary'}>
                email
              </Typography>
            </Typography>

            <Spacer sp={3} />
            {/* 
            <Typography variant="body2">
              <strong>Hello {user?.first_name},</strong> please{' '}
              <strong>confirm your email address</strong> before proceeding to
              use the foodie platform.
            </Typography> */}

            <Typography variant="body2">
              Hello {user?.first_name}, please enter the 6 digit OTP sent to{' '}
              <strong>{user?.email}</strong>
            </Typography>

            <Spacer sp={3} />
            <MuiOtpInput
              my={4}
              TextFieldsProps={{ inputProps: { inputMode: 'numeric' } }}
              mx={isMobile ? 1 : 0}
              gap={isMobile ? 1 : 2}
              value={OTP}
              onComplete={onComplete}
              onChange={onChange}
              length={6}
            />

            {error && (
              <LoadingBox my={4}>
                <Alert severity="error">{error}</Alert>
              </LoadingBox>
            )}
            {loading && (
              <LoadingBox my={4}>
                <CircularProgress color="grey" size={18} />
              </LoadingBox>
            )}

            <Typography textAlign={'center'} variant="body2">
              If you haven't received your OTP, use the button below to send a
              new one.
            </Typography>
            <Box mt={4} display={'flex'} justifyContent={'center'}>
              <LoadingButton
                loading={false}
                type="submit"
                onClick={onResend}
                variant="contained"
                color="primary"
              >
                Resend OTP
              </LoadingButton>
            </Box>
          </Box>

          {/* {!isMobile && ( */}
          <Image
            duration={200}
            width={isMobile ? 120 : 200}
            src={UndrawSVG}
            alt={'undraw'}
            wrapperStyle={{
              margin: isTablet ? 'auto' : '',
              marginBottom: isTablet ? 16 : 0,
              flex: 0.65
            }}
          />
          {/* )} */}
        </Box>
      </Box>
    </>
  );
};

PageConfirmEmail.propTypes = {};

export default PageConfirmEmail;
