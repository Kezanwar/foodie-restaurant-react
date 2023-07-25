import React, { useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import { Box, Container, Stack, Typography, styled } from '@mui/material';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';

import { DashboardTitleContainer } from '../styles';
import LoadingScreen from '../../../components/loading-screen/LoadingScreen';
import DashboardTitle from '../../../components/dashboard-title/DashboardTitle';

import useRestaurantQuery from '../../../hooks/queries/useRestaurantQuery';
import RestaurantProfileIphone from '../../../features/iphone/RestaurantProfileIphone';
import Spacer from '../../../components/spacer/Spacer';
import Subheader from '../../../components/subheader/Subheader';
import useCustomMediaQueries from '../../../hooks/useCustomMediaQueries';
import LightLoadingButton from '../../../components/light-loading-button/LightLoadingButton';
import { PATH_DASHBOARD } from '../../../routes/paths';

const CompanyDetailsWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  gap: theme.spacing(6)
}));

const ActionsWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center'
}));

const Restaurant = (props) => {
  const navigate = useNavigate();
  const { data, isLoading } = useRestaurantQuery();
  const restaurant = data?.data;

  const { company_address, company_name, company_number } =
    restaurant?.company_info || {};

  const { isMobile } = useCustomMediaQueries();

  const onEdit = useCallback(() => {
    navigate(PATH_DASHBOARD.restaurant_edit);
  }, []);

  if (isLoading) return <LoadingScreen />;
  return (
    <>
      <Helmet>
        <title> {restaurant?.name || ''} | Foodie</title>
        <link rel="stylesheet" type="text/css" href="/styles/devices.css" />
      </Helmet>

      <Container sx={{ px: 3 }} maxWidth={'xl'}>
        <DashboardTitleContainer textAlign={'center'}>
          <DashboardTitle title={`${restaurant?.name}`} />
          <Typography variant="body2" color={'text.secondary'}>
            You can view and edit your Restaurant Profile here.
          </Typography>
        </DashboardTitleContainer>
        <ActionsWrapper>
          <LightLoadingButton
            variant="text"
            onClick={onEdit}
            endIcon={<DriveFileRenameOutlineOutlinedIcon />}
          >
            Edit profile
          </LightLoadingButton>
        </ActionsWrapper>
        <Stack mt={6} width={'100%'}>
          <CompanyDetailsWrapper>
            <Box textAlign={'center'}>
              <Subheader text={'Company Name'} />
              <Spacer sp={1} />
              <Typography
                variant="body2"
                sx={{ wordBreak: 'break-word' }}
                fontSize={16}
              >
                {company_name || ''}
              </Typography>
            </Box>
            <Box textAlign={'center'}>
              <Subheader text={'Company Address'} />
              <Spacer sp={1} />
              <Typography
                variant="body2"
                sx={{ wordBreak: 'break-word' }}
                fontSize={16}
              >
                {company_address?.address_line_1 || ''}
              </Typography>
              <Typography
                variant="body2"
                sx={{ wordBreak: 'break-word' }}
                fontSize={16}
              >
                {company_address?.address_line_2 || ''}
              </Typography>
              <Typography
                variant="body2"
                sx={{ wordBreak: 'break-word' }}
                fontSize={16}
              >
                {company_address?.postcode || ''}
              </Typography>
            </Box>
            {company_number && (
              <Box textAlign={'center'}>
                <Subheader text={'Company Number'} />
                <Spacer sp={1} />
                <Typography
                  variant="body2"
                  sx={{ wordBreak: 'break-word' }}
                  fontSize={16}
                >
                  {company_number}
                </Typography>
              </Box>
            )}
          </CompanyDetailsWrapper>
          <Spacer sp={isMobile ? 0 : 6} />
          <RestaurantProfileIphone />
        </Stack>
      </Container>
    </>
  );
};

Restaurant.propTypes = {};

export default Restaurant;
