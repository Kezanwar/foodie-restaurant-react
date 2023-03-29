import React from 'react';
import Image from 'mui-image';
import { useNavigate } from 'react-router';
import { m } from 'framer-motion';
import PropTypes from 'prop-types';
import { Container } from '@mui/system';
import { Box, Button, Stack, Typography } from '@mui/material';

import Spacer from '../../components/spacer/Spacer';
import MotionDivViewport from '../../components/animate/MotionDivViewport';
import UndrawSVG from '../../assets/undraw-content-team-8.svg';

import { PATH_NEW_RESTAURANT } from '../../routes/paths';
import useCustomMediaQueries from '../../hooks/useCustomMediaQueries';
import { useAuthContext } from '../../hooks/useAuthContext';

const NewRestaurantGetStarted = (props) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { isMobile } = useCustomMediaQueries();

  return (
    <MotionDivViewport
      initial={{ translateY: 10 }}
      animate={{ translateY: 0 }}
      exit={{ translateY: 50 }}
      transition={{ duration: 0.4 }}
    >
      <Container maxWidth={'lg'}>
        <Stack justifyContent={'center'} alignItems={'center'} mt={0}>
          <Box layoutId="undraw-svg" layout component={m.div}>
            <Image
              duration={200}
              width={isMobile ? '80vw' : 400}
              src={UndrawSVG}
              alt={'undraw'}
              wrapperStyle={{ marginBottom: 32 }}
            />
          </Box>

          <Typography textAlign={'center'} variant="h3" pb={2} component="h1">
            {user?.first_name
              ? `Hello ${user?.first_name},`
              : 'Welocome to Foodie'}
          </Typography>
          <Typography
            textAlign={'center'}
            color={'text.secondary'}
            pb={2}
            variant={'body2'}
            maxWidth={!isMobile ? '80%' : '100%'}
          >
            It looks like you're new here, you'll need to submit a new
            restaurant application before you can start posting content/deals
            and tapping into the foodie userbase!
          </Typography>

          <Typography
            textAlign={'center'}
            color={'text.secondary'}
            pb={2}
            variant={'body2'}
            maxWidth={!isMobile ? '80%' : '100%'}
          >
            The application process typically takes{' '}
            <Box display={'inline'} fontWeight={'600'} color={'primary.main'}>
              9-12 minutes
            </Box>
          </Typography>
          <Spacer sp={1} />
          <Button
            sx={{
              width: 'max-content',
              alignSelf: 'center',
              bgcolor: 'text.primary',
              color: (theme) =>
                theme.palette.mode === 'light' ? 'common.white' : 'grey.800'
              //   '&:hover': {
              //     bgcolor: 'text.primary',
              //     color: (theme) =>
              //       theme.palette.mode === 'light' ? 'common.white' : 'grey.800'
              //   }
            }}
            variant="contained"
            color="primary"
            onClick={() => navigate(PATH_NEW_RESTAURANT.step_1)}
          >
            Get started
          </Button>
        </Stack>
      </Container>
    </MotionDivViewport>
  );
};

NewRestaurantGetStarted.propTypes = {};

export default NewRestaurantGetStarted;
