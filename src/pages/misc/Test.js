import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import AddressAutocomplete from '../../components/address-autocomplete/AddressAutocomplete';

const Test = (props) => {
  return (
    <Box>
      <AddressAutocomplete />
    </Box>
  );
};

Test.propTypes = {};

export default Test;
