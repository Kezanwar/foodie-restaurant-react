import React from 'react';

import { Box, Button, Typography, styled } from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { useNavigate } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
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

const DealTableEmpty = ({ type }) => {
  const nav = useNavigate();
  const restQuery = useRestaurantQuery();

  const isSubscribed = !!restQuery.data?.data?.is_subscribed;
  return (
    <Container>
      <SentimentVeryDissatisfiedIcon color="primary" fontSize="large" />
      <Typography>Sorry their aren't any {type} deals to show </Typography>
      {isSubscribed && (
        <Button
          variant="contained"
          onClick={() => nav(PATH_DASHBOARD.deals_create)}
          sx={sx}
        >
          Create a new deal
        </Button>
      )}
    </Container>
  );
};

DealTableEmpty.propTypes = {};

export default DealTableEmpty;
