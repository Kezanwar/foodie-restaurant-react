import { Link as L, Typography, Breadcrumbs as B } from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const Breadcrumbs = ({ trail, current, ...rest }) => {
  return (
    <B {...rest} aria-label="breadcrumb">
      {trail?.map((route) => {
        return (
          <L
            to={route.link}
            component={RouterLink}
            key={route.name}
            underline="hover"
            color="inherit"
            href={route.link}
          >
            {route.name}
          </L>
        );
      })}
      <Typography color="primary.main">{current}</Typography>
    </B>
  );
};

export default Breadcrumbs;
