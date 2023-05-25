import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {
  Box,
  CircularProgress,
  Menu,
  MenuItem,
  TextField,
  Typography
} from '@mui/material';

import useDebounce from '../../hooks/useDebounce';

const GEOAPIFY_API_KEY = process.env.REACT_APP_GEOAPIFY_KEY;

const fetchAddresses = (str) => {
  return axios.get(
    `https://api.geoapify.com/v1/geocode/autocomplete?text=${str}&apiKey=${GEOAPIFY_API_KEY}`
  );
};

const DEBOUNCE_TIME = 400;

const AddressAutocomplete = ({ handleOnAddressSelect }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [houseNumber, setHouseNumber] = useState('');

  const debounced = useDebounce(searchTerm, DEBOUNCE_TIME);

  const [loading, setLoading] = useState(false);

  const open = Boolean(anchorEl);

  const anchorRef = useRef(null);

  const handleShow = () => {
    setAnchorEl(anchorRef.current);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setResults([]);
  };

  const handleOnChange = (e) => {
    if (anchorEl) handleClose();
    setSearchTerm(e.target.value);
  };

  const handleSearchAddress = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchAddresses(debounced);
      const resultz = res?.data?.features;
      const houseNum = res?.data?.query?.parsed?.housenumber;
      setResults(resultz?.length ? resultz : []);
      setHouseNumber(houseNum || '');
      handleShow();
    } catch (error) {
      setResults([]);
      setHouseNumber('');
      console.error(error);
    }
    setLoading(false);
  }, [debounced]);

  useEffect(() => {
    if (debounced?.length > 3) {
      handleSearchAddress();
    }
  }, [debounced]);

  return (
    <Box sx={{ position: 'relative' }}>
      <TextField
        ref={anchorRef}
        fullWidth
        id="address-autocomplete"
        aria-controls={open ? 'address-results' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant={'filled'}
        label={'Search for an address'}
        placeholder="e.g 24 Red Baloon Street Manchester M2 3HG"
        onChange={handleOnChange}
        value={searchTerm}
      />

      <Menu
        id="address-results"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        autoFocus={false}
        disableAutoFocus
        disableAutoFocusItem
        MenuListProps={{
          autoFocus: false,
          autoFocusItem: false,
          'aria-labelledby': 'address-autocomplete',
          sx: {
            width: anchorEl && anchorEl.offsetWidth
          }
          // anchorOrigin: {
          //   vertical: 'bottom',
          //   horizontal: 'left'
          // },
          // transformOrigin: {
          //   vertical: 'top',
          //   horizontal: 'left'
          // }
        }}
      >
        {results?.length ? (
          results.map((result) => {
            const formatted = result?.properties?.formatted;
            const houseNum =
              formatted.split(' ')[0] === houseNumber ? '' : houseNumber;
            return (
              <MenuItem
                key={result?.properties?.place_id}
                onClick={handleClose}
              >
                {`${houseNum} ${result?.properties?.formatted}`}
              </MenuItem>
            );
          })
        ) : (
          <MenuItem onClick={handleClose}>No results found...</MenuItem>
        )}
      </Menu>
      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {loading && (
            <>
              <CircularProgress size={14} />
              <Typography ml={1} variant="body2">
                Finding addresses...
              </Typography>
            </>
          )}
        </Box>
        <Box>
          <Typography variant="body2">
            Powered by{' '}
            <Typography
              target="_blank"
              color={'primary.main'}
              rel="noreferrer"
              href="https://www.geoapify.com/"
              variant="body2"
              component={'a'}
              tabIndex={-1}
            >
              Geoapify
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

AddressAutocomplete.propTypes = {
  handleOnAddressSelect: PropTypes.func
};

export default AddressAutocomplete;
