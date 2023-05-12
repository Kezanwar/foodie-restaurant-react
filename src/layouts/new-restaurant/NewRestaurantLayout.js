import { useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Image from 'mui-image';
import {
  Container,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Box
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { StyledContent, StyledRoot } from './styles';

import Header from './header';
import { useAuthContext } from '../../hooks/useAuthContext';
import { MotionContainer } from '../../components/animate';

import { FORM_STEPS } from '../../pages/new-restaurant/util';
import { PATH_DASHBOARD } from '../../routes/paths';
import Spacer from '../../components/spacer/Spacer';

import useRestaurantQuery from '../../hooks/queries/useRestaurantQuery';
import UndrawSVG from '../../assets/undraw-content-team-8.svg';
import useCustomMediaQueries from '../../hooks/useCustomMediaQueries';
import LoadingScreen from '../../components/loading-screen/LoadingScreen';
import MotionDivViewport from '../../components/animate/MotionDivViewport';
import { RESTAURANT_STATUS } from '../../constants/restaurants.constants';

const disallowedRestStatusArr = Object.values(RESTAURANT_STATUS).filter(
  (status) =>
    status !== RESTAURANT_STATUS.APPLICATION_PENDING &&
    status !== RESTAURANT_STATUS.APPLICATION_PROCESSING &&
    status !== RESTAURANT_STATUS.APPLICATION_REJECTED
);

export default function NewRestaurantLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { pathname } = location;
  const pathSplit = pathname.split('/');

  const activeFormStep = useMemo(() => {
    return FORM_STEPS.findIndex((step) =>
      pathSplit.find((e) => e === step.step)
    );
  }, [pathSplit]);

  const { data, isLoading } = useRestaurantQuery();

  const { isMobile, isTablet } = useCustomMediaQueries();

  const restName = useMemo(() => {
    return data?.data?.name || data?.data?.company_info?.company_name;
  }, [data?.data?.name, data?.data?.company_info?.company_name]);

  useEffect(() => {
    if (data?.data) {
      if (
        disallowedRestStatusArr.some((status) => status === data?.data?.status)
      ) {
        navigate(PATH_DASHBOARD.overview);
      }
    }
  }, [data?.data, navigate]);

  return (
    <StyledRoot>
      <Helmet>
        <title> New Restaurant | Foodie</title>
        <link rel="stylesheet" type="text/css" href="/styles/devices.css" />
      </Helmet>
      <Header />

      <StyledContent>
        <Stack sx={{ width: 1 }}>
          <Container maxWidth={'lg'}>
            {activeFormStep !== -1 && (
              <>
                <Box mb={isMobile ? 2 : 6}>
                  <Box sx={{ display: 'flex' }}>
                    {isMobile ? null : (
                      <Box>
                        <Image
                          duration={100}
                          width={125}
                          src={UndrawSVG}
                          alt={'undraw'}
                        />
                      </Box>
                    )}
                    <Box ml={isMobile ? 0 : 2}>
                      <Box
                        mb={isTablet ? 2 : 0.5}
                        // sx={{ display: 'flex', alignItems: 'baseline' }}
                      >
                        <Typography
                          variant="h3"
                          component="h3"
                          // fontSize={isTablet ? '1.2rem' : '1.5rem'} d
                          display={'inline'}
                        >
                          {restName
                            ? `${restName} Application`
                            : 'New Restaurant Application'}
                          :
                        </Typography>
                        <Typography
                          variant="h3"
                          component="h3"
                          // fontSize={isTablet ? '1.2rem' : '1.5rem'}
                          color={'primary'}
                          ml={1}
                          display={'inline'}
                        >
                          Step {activeFormStep + 1}
                        </Typography>
                      </Box>

                      <Typography
                        variant="body2"
                        color={'text.secondary'}
                        gutterBottom
                      >
                        Create your Foodie application, then start creating
                        vouchers and tapping into our Foodie userbase!
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Stepper activeStep={activeFormStep}>
                  {FORM_STEPS.map((f, index) => (
                    <Step key={f.label}>
                      <StepLabel>{f.label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                <Spacer sp={6} />
              </>
            )}
            {isLoading ? <LoadingScreen /> : <Outlet />}
          </Container>
        </Stack>
      </StyledContent>
    </StyledRoot>
  );
}
