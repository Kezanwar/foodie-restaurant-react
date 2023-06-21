import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Typography } from '@mui/material';

import { DashboardTitleContainer } from '../styles';
import DashboardTitle from '../../../components/dashboard-title/DashboardTitle';
import useRestaurantQuery from '../../../hooks/queries/useRestaurantQuery';
import DealTableTabs from '../../../components/deal-tables/DealTableTabs';

const DealsAll = (props) => {
  const resQuery = useRestaurantQuery();

  const restaurant = resQuery?.data?.data;
  return (
    <>
      <Helmet>
        <title> All deals | Foodie</title>
      </Helmet>

      <Container sx={{ px: 3 }} maxWidth={'xl'}>
        <DashboardTitleContainer>
          <DashboardTitle title={`All ${restaurant.name} deals`} />
          <Typography variant="body2" color={'text.secondary'}>
            You can view and manage you're deals here.
          </Typography>
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
