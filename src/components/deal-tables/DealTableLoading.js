import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  styled
} from '@mui/material';
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
