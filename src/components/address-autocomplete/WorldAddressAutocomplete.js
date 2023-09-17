import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@mui/icons-material';
import axios from 'axios';
import PropTypes from 'prop-types';
import {
  Box,
  CircularProgress,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Typography
} from '@mui/material';

import useDebounce from '../../hooks/useDebounce';
import { AddressSearchUnderWrapper, LoadingWrapper } from './styles';
import { countries } from '../../assets/data';

const GEOAPIFY_API_KEY = process.env.REACT_APP_GEOAPIFY_KEY;

const fetchAddresses = (str) => {
  return axios.get(
    `https://api.geoapify.com/v1/geocode/autocomplete?text=${str}&apiKey=${GEOAPIFY_API_KEY}`
  );
};

const DEBOUNCE_TIME = 400;

const GeoapifyLink = () => {
  return (
    <Box sx={{ mb: 1, display: 'flex' }}>
      <Typography fontSize={'14px'} variant="body2">
        Powered by{' '}
        <Typography
          fontSize={'14px'}
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
  );
};

const LoadingAddresses = () => {
  return (
    <>
      <CircularProgress size={14} />
      <Typography fontSize={'14px'} ml={1} variant="body2">
        Searching...
      </Typography>
    </>
  );
};

const WorldAddressAutocomplete = ({ handleOnAddressSelect }) => {
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

  const handleOnSelect = useCallback(
    // eslint-disable-next-line consistent-return
    (properties) => {
      if (!properties) return null;
      const {
        address_line1,
        address_line2,
        city,
        country,
        country_code,
        county,
        lat,
        lon,
        postcode,
        state,
        suburb,
        timezone
      } = properties;

      if (handleOnAddressSelect) {
        handleOnAddressSelect({
          address_line_1: `${houseNumber} ${address_line1}`,
          address_line_2: suburb || '',
          city,
          country: countries.find(
            (c) => c.code === country_code?.toUpperCase()
          ) || { label: country },
          county,
          lat,
          lon,
          postcode,
          state,
          suburb,
          timezone: timezone?.name
        });
      }
      handleClose();
    },
    [handleOnAddressSelect, houseNumber]
  );

  return (
    <Box>
      <TextField
        autoComplete="new-password"
        InputProps={{
          autoComplete: 'off',
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlined fontSize="small" />
            </InputAdornment>
          )
          // endAdornment: loading ? <CircularProgress size={20} /> : null
        }}
        ref={anchorRef}
        fullWidth
        id="address-autocomplete"
        aria-controls={open ? 'address-results' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant={'filled'}
        label={'Quickly search for an address'}
        placeholder="e.g 24 Greystoke Street Didsbury Manchester"
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
                onClick={(e) => {
                  e.preventDefault();
                  handleOnSelect(result.properties);
                }}
              >
                {`${houseNum} ${result?.properties?.formatted}`}
              </MenuItem>
            );
          })
        ) : (
          <MenuItem onClick={handleClose}>No results found...</MenuItem>
        )}
      </Menu>
      <AddressSearchUnderWrapper>
        <LoadingWrapper>{loading && <LoadingAddresses />}</LoadingWrapper>
        <GeoapifyLink />
      </AddressSearchUnderWrapper>
    </Box>
  );
};

WorldAddressAutocomplete.propTypes = {
  handleOnAddressSelect: PropTypes.func
};

export default WorldAddressAutocomplete;
