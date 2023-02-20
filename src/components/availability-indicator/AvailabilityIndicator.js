import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/system';
import { CircularProgress, Typography } from '@mui/material';
import ThumbUpAltTwoToneIcon from '@mui/icons-material/ThumbUpAltTwoTone';
import ThumbDownAltTwoToneIcon from '@mui/icons-material/ThumbDownAltTwoTone';

const AvailabilityIndicator = ({ isLoading, success, resultName }) => {
  const text = () => {
    if (isLoading) return 'Checking availability...';
    if (!isLoading) {
      if (!success) return `Sorry, that ${resultName} isn't available...`;
      if (success) return `That ${resultName} is available`;
    }
    return '';
  };

  const color = () => {
    if (isLoading) return 'grey_palette.main';
    if (!isLoading) {
      if (!success) return `error_red.main`;
      if (success) return `success.main`;
    }
    return '';
  };

  const icon = () => {
    if (isLoading) return <CircularProgress sx={{ marginRight: 1 }} size={'1rem'} color={'grey_palette'} />;
    if (!isLoading) {
      if (!success) return <ThumbDownAltTwoToneIcon sx={{ height: 16 }} color="error_red" />;
      if (success) return <ThumbUpAltTwoToneIcon sx={{ height: 16 }} color="success" />;
    }
    return '';
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box mb={-0.75} mr={1}>
        {icon()}
      </Box>
      <Typography sx={{ color: color(), fontWeight: 600, letterSpacing: -0.5 }}>{text()}</Typography>
    </Box>
  );
};

AvailabilityIndicator.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
  resultName: PropTypes.string.isRequired,
};

export default React.memo(AvailabilityIndicator);
