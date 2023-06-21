import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Typography, styled } from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

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
  return (
    <Container>
      <SentimentVeryDissatisfiedIcon color="primary" fontSize="large" />
      <Typography>Sorry their aren't any {type} deals to show </Typography>
      <Button variant="contained" sx={sx}>
        Create a new deal
      </Button>
    </Container>
  );
};

DealTableEmpty.propTypes = {};

export default DealTableEmpty;
