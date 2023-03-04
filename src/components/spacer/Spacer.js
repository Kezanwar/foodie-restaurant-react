import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/system';

const Spacer = ({ sp = 4 }) => {
  return <Box mb={sp} />;
};

Spacer.propTypes = {
  sp: PropTypes.number
};

export default Spacer;
