import React from 'react';
import { LoadingButton } from '@mui/lab';

const sx = {
  bgcolor: 'text.primary',
  py: 1.25,
  color: (theme) =>
    theme.palette.mode === 'light' ? 'common.white' : 'grey.800',
  '&:hover': {
    bgcolor: 'text.primary',
    color: (theme) =>
      theme.palette.mode === 'light' ? 'common.white' : 'grey.800'
  }
};

const BlackLoadingButton = (props) => {
  return (
    <LoadingButton variant="contained" color="inherit" sx={sx} {...props} />
  );
};

export default BlackLoadingButton;
