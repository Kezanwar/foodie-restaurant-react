import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

const DashboardTitle = ({ title }) => {
  return (
    <Typography variant="h3" component="h1">
      {title}
    </Typography>
  );
};

DashboardTitle.propTypes = {
  title: PropTypes.string
};

export default DashboardTitle;
