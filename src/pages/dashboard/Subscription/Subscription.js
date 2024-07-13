import React from 'react';
import { Helmet } from 'react-helmet-async';

import { Box, Container, Stack, Typography, styled } from '@mui/material';
import { useNavigate } from 'react-router';

import useRestaurantQuery from 'hooks/queries/useRestaurantQuery';
import { DashboardTitleContainer } from '../styles';
import DashboardTitle from 'components/dashboard-title/DashboardTitle';
import PricingTable from 'components/pricing';

const LocationsAll = () => {
  const resQuery = useRestaurantQuery();

  const nav = useNavigate();

  const restaurant = resQuery?.data?.data || {};

  const isSubscribed = !!restaurant.is_subscribed;

  return (
    <>
      <Helmet>
        <title> Locations | Foodie</title>
      </Helmet>

      <Container sx={{ px: 3, pb: 4 }} maxWidth={'xl'}>
        <DashboardTitleContainer>
          <DashboardTitle title="Subscriptions" />
          <Typography mb={2} variant="body2" color={'text.secondary'}>
            You can view and manage {restaurant.name}'s subscriptions here.
          </Typography>
        </DashboardTitleContainer>
        <PricingTable />
      </Container>
    </>
  );
};

export default LocationsAll;
