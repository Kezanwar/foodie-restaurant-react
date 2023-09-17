import React, { useCallback, useRef, useState } from 'react';
import { SearchOutlined } from '@mui/icons-material';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import axios from 'axios';
import PropTypes from 'prop-types';
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Typography,
  styled
} from '@mui/material';

import { AddressSearchUnderWrapper, LoadingWrapper } from './styles';

import useDebounce from '../../hooks/useDebounce';
import { countries } from '../../assets/data';
import { RAPID_KEY } from '../../config';

const fetchAddresses = (str) => {
  return axios.get('https://postcodr.p.rapidapi.com/lookup', {
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': RAPID_KEY,
      'X-RapidAPI-Host': 'postcodr.p.rapidapi.com'
    },
    params: { q: str }
  });
};

const DEBOUNCE_TIME = 400;

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

export const SearchWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center'
}));

export const IconBtn = styled(IconButton)(() => ({
  height: '100%',
  aspectRatio: '1/1'
}));

const UKAddressAutocomplete = ({ handleOnAddressSelect }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(false);

  const open = Boolean(anchorEl);

  const anchorRef = useRef(null);

  const handleShow = () => {
    setAnchorEl(anchorRef.current);
  };

  const handleClose = () => {
    setAnchorEl(null);
    // setResults([]);
  };

  const handleOnChange = (e) => {
    if (anchorEl) handleClose();
    setSearchTerm(e.target.value);
  };

  const searchTermRef = useRef('');

  const handleSearchAddress = useCallback(async () => {
    if (searchTerm === searchTermRef.current) {
      handleShow();
    } else {
      try {
        setLoading(true);
        const res = await fetchAddresses(searchTerm);
        setResults(res?.data?.addresses);
        handleShow();
      } catch (error) {
        setResults([]);
        console.error(error);
      }
      setLoading(false);
      searchTermRef.current = searchTerm;
    }
  }, [searchTerm]);

  const handleOnSelect = useCallback(
    // eslint-disable-next-line consistent-return
    (result) => {
      if (!result) return null;
      const { line_1, line_2, county, town, postcode } = result.address_parts;

      if (handleOnAddressSelect) {
        handleOnAddressSelect({
          address_line_1: line_1,
          address_line_2: `${line_2}${line_2 && county ? ', ' : ''}${county}`,
          country: countries.find((c) => c.code === 'GB'),
          county,
          city: town,
          postcode
        });
      }
      handleClose();
    },
    [handleOnAddressSelect]
  );

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (searchTerm?.length >= 3) handleSearchAddress();
    }
  };

  return (
    <Box>
      <SearchWrapper>
        <TextField
          autoComplete="new-password"
          InputProps={{
            autoComplete: 'off',
            startAdornment: (
              <InputAdornment position="start">
                <CreateOutlinedIcon fontSize="small" />
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
          label={'Quickly search by postcode'}
          placeholder="e.g M1 3NF"
          onChange={handleOnChange}
          onKeyDown={handleKeyDown}
          value={searchTerm}
        />
        <IconBtn
          color="primary"
          disabled={searchTerm.length < 3}
          onClick={handleSearchAddress}
        >
          <SearchOutlined />
        </IconBtn>
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
              const formatted = result.formatted_text;
              return (
                <MenuItem
                  key={formatted}
                  onClick={(e) => {
                    e.preventDefault();
                    handleOnSelect(result);
                  }}
                >
                  {`${formatted}`}
                </MenuItem>
              );
            })
          ) : (
            <MenuItem onClick={handleClose}>No results found...</MenuItem>
          )}
        </Menu>
      </SearchWrapper>

      <AddressSearchUnderWrapper>
        <LoadingWrapper>{loading && <LoadingAddresses />}</LoadingWrapper>
      </AddressSearchUnderWrapper>
    </Box>
  );
};

UKAddressAutocomplete.propTypes = {
  handleOnAddressSelect: PropTypes.func
};

export default UKAddressAutocomplete;
