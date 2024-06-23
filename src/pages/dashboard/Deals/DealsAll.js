import React from 'react';

import { Helmet } from 'react-helmet-async';
import { Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';

import { DashboardTitleContainer } from '../styles';
import DashboardTitle from 'components/dashboard-title/DashboardTitle';
import DealTableTabs from 'components/deal-tables/DealTableTabs';
import LoadingScreen from 'components/loading-screen/LoadingScreen';

import useRestaurantQuery from 'hooks/queries/useRestaurantQuery';
import LightLoadingButton from 'components/light-loading-button/LightLoadingButton';
import { PATH_DASHBOARD } from 'routes/paths';

const DealsAll = (props) => {
  const resQuery = useRestaurantQuery();
  const nav = useNavigate();

  const restaurant = resQuery?.data?.data;

  const restLoading = resQuery?.isLoading;

  const onCreateDeal = () => nav(PATH_DASHBOARD.deals_create);

  if (restLoading) return <LoadingScreen />;
  return (
    <>
      <Helmet>
        <title> All deals | Foodie</title>
      </Helmet>

      <Container sx={{ px: 3 }} maxWidth={'xl'}>
        <DashboardTitleContainer>
          <DashboardTitle title="Deals" />

          <Typography mb={2} variant="body2" color={'text.secondary'}>
            You can view and manage {restaurant.name}'s Deals here.
          </Typography>

          <LightLoadingButton
            onClick={onCreateDeal}
            endIcon={<DriveFileRenameOutlineOutlinedIcon />}
          >
            Create a new deal
          </LightLoadingButton>
        </DashboardTitleContainer>
        <Box>
          <DealTableTabs />
        </Box>
      </Container>
    </>
  );
};

DealsAll.propTypes = {};

export default DealsAll;
