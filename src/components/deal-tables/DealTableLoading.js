import React from 'react';

import { Box, CircularProgress, Typography, styled } from '@mui/material';

export const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: theme.spacing(2),
  minHeight: '20vh',
  borderRadius: '8px'
}));

const DealTableLoading = ({ type }) => {
  return (
    <Container>
      <CircularProgress size={24} />
      <Typography>Loading {type} deals... </Typography>
    </Container>
  );
};

DealTableLoading.propTypes = {};

export default DealTableLoading;
