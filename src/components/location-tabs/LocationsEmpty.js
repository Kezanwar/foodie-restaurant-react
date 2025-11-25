import React from 'react';

import { Box, Button, Typography, styled } from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { useNavigate } from 'react-router';

import useRestaurantQuery from 'hooks/queries/useRestaurantQuery';

export const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: theme.spacing(2),
  minHeight: '20vh',
  borderRadius: '8px'
}));

const sx = {
  bgcolor: 'text.primary',
  color: (theme) =>
    theme.palette.mode === 'light' ? 'common.white' : 'grey.800'
};

const LocationsEmpty = ({ type }) => {
  const nav = useNavigate();
  const restQuery = useRestaurantQuery();

  const isSubscribed = !!restQuery.data?.restaurant?.is_subscribed;
  return (
    <Container>
      <SentimentVeryDissatisfiedIcon color="primary" fontSize="large" />
      <Typography>Sorry their aren't any {type} locations to show </Typography>
      {isSubscribed && (
        <Button
          variant="contained"
          onClick={() => nav('/dashboard/locations/add')}
          sx={sx}
        >
          Create a new location
        </Button>
      )}
    </Container>
  );
};

LocationsEmpty.propTypes = {};

export default LocationsEmpty;
