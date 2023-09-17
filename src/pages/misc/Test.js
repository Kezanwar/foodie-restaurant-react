import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Autocomplete, Box, TextField } from '@mui/material';
import AddressAutocomplete from '../../components/address-autocomplete/AddressAutocomplete';
import Spacer from '../../components/spacer/Spacer';
import { countries, countryToFlag } from '../../assets/data';

const Test = (props) => {
  const [value, setValue] = useState(countries[0]);
  // const [inputValue, setInputValue] = useState(countries[0].label);

  console.log('value:', value);
  // console.log('inputValue:', inputValue);
  return (
    <Box>
      <AddressAutocomplete />
    </Box>
  );
};

Test.propTypes = {};

export default Test;
