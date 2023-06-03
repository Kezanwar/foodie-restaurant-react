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
      <Spacer sp={8} />
      <Autocomplete
        fullWidth
        value={value}
        options={countries}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        getOptionLabel={(option) => option.label}
        renderOption={(props, option) => (
          <Box
            component="li"
            value={option.label}
            {...props}
            sx={{ px: '8px !important' }}
          >
            <Box component="span" sx={{ flexShrink: 0, mr: 2, fontSize: 22 }}>
              {countryToFlag(option.code)}
            </Box>
            {option.label} ({option.code}) +{option.phone}
            <input readOnly value={option.label} style={{ display: 'none' }} />
          </Box>
        )}
        renderInput={(params) => <TextField {...params} label="Controllable" />}
      />
      <button type="button" onClick={() => setValue(countries[3])}>
        click
      </button>
    </Box>
  );
};

Test.propTypes = {};

export default Test;
