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
import { PATH_DASHBOARD } from 'routes/paths';
import Spacer from 'components/spacer/Spacer';

import useRestaurantQuery from 'hooks/queries/useRestaurantQuery';
import UndrawSVG from 'assets/undraw-content-team-8.svg';
import useCustomMediaQueries from 'hooks/useCustomMediaQueries';
import LoadingScreen from 'components/loading-screen/LoadingScreen';

import Permissions from 'lib/permissions';

const FORM_STEPS = [
  { label: 'Company Info', step: 'step-1' },
  { label: 'Create Restaurant', step: 'step-2' },
  { label: 'Add Location', step: 'step-3' },
  { label: 'Review Application', step: 'step-4' }
];

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
      if (data.data.status && Permissions.canViewDashboard(data.data.status)) {
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
                      <Box mb={isTablet ? 2 : 0.5}>
                        <Typography
                          variant="h3"
                          component="h3"
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
                        deals and tapping into our Foodie userbase!
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Stepper activeStep={activeFormStep}>
                  {FORM_STEPS.map((f, _) => (
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
