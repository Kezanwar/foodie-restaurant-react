import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { LoadingButton } from '@mui/lab';

import Image from 'mui-image';

import { useAuthContext } from '../../hooks/useAuthContext';
import Spacer from '../../components/spacer/Spacer';
import UndrawSVG from '../../assets/undraw-completing.svg';
import useCustomMediaQueries from '../../hooks/useCustomMediaQueries';
import { usePathAfterLogin } from '../../hooks/usePathAfterLogin';

const PageConfirmEmail = (props) => {
  const { user, emailConfirmed } = useAuthContext();
  const { isMobile, isTablet } = useCustomMediaQueries();
  const pathAfterLogin = usePathAfterLogin();
  const navigate = useNavigate();

  useEffect(() => {
    if (emailConfirmed) {
      navigate(pathAfterLogin);
    }
  }, [emailConfirmed, navigate, pathAfterLogin]);

  return (
    <>
      <Helmet>
        <title> Confirm email | Foodie</title>
      </Helmet>

      <Box textAlign={isTablet ? 'center' : 'left'}>
        <Spacer />
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

            <Typography variant="body2">
              <strong>Hello {user?.first_name},</strong> please{' '}
              <strong>confirm your email address</strong> before proceeding to
              use the foodie platform.
            </Typography>
            <Spacer sp={3} />
            <Typography variant="body2">
              An email was sent to <strong>{user?.email},</strong> follow the
              link to verify you are the owner of the account.
            </Typography>
            <Spacer sp={3} />
            <Typography variant="body2">
              If you haven't received it, use the button below to resend it.
            </Typography>
            <Box mt={4}>
              <LoadingButton
                loading={false}
                type="submit"
                // color={'grey_palette'}
                variant="contained"
                color="primary"
              >
                Resend
              </LoadingButton>
            </Box>
          </Box>

          <Image
            duration={200}
            width={200}
            src={UndrawSVG}
            alt={'undraw'}
            wrapperStyle={{
              margin: 'auto',
              marginBottom: 32,
              flex: 0.65
            }}
          />
        </Box>
      </Box>
    </>
  );
};

PageConfirmEmail.propTypes = {};

export default PageConfirmEmail;
