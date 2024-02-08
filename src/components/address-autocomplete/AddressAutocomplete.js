import PropTypes from 'prop-types';
import React, { useCallback, useRef, useState } from 'react';
import { SearchOutlined } from '@mui/icons-material';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import axios from 'axios';

import {
  Box,
  CircularProgress,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Typography
} from '@mui/material';

import { countries } from 'assets/data';

import { MATCH_POSTCODE } from 'utils/regex';

import { GEOAPIFY_API_KEY, RAPID_KEY } from '../../config';

import {
  AddressSearchUnderWrapper,
  IconBtn,
  LoadingWrapper,
  SearchWrapper
} from './styles';

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

const fetchAddressesPostcodeSearch = (str) => {
  return axios.get('https://postcodr.p.rapidapi.com/lookup', {
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': RAPID_KEY,
      'X-RapidAPI-Host': 'postcodr.p.rapidapi.com'
    },
    params: { q: str }
  });
};

const fetchAddressesTextSearch = (str) => {
  return axios.get(
    `https://api.geoapify.com/v1/geocode/autocomplete?text=${str}&apiKey=${GEOAPIFY_API_KEY}`
  );
};

const SEARCH_TYPES = {
  POSTCODE: 'POSTCODE',
  ADDRESS: 'ADDRESS'
};

const AddressAutocomplete = ({ handleOnAddressSelect }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [houseNumber, setHouseNumber] = useState('');
  const [searchType, setSearchType] = useState('');

  const [loading, setLoading] = useState(false);

  const open = Boolean(anchorEl);

  const anchorRef = useRef(null);

  const handleShow = () => {
    setAnchorEl(anchorRef.current);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
      const isPostcode = !!searchTerm.match(MATCH_POSTCODE);

      switch (isPostcode) {
        case true:
          try {
            setLoading(true);
            const res = await fetchAddressesPostcodeSearch(searchTerm);
            setResults(res?.data?.addresses);
            handleShow();
            setSearchType(SEARCH_TYPES.POSTCODE);
          } catch (error) {
            setResults([]);
            console.error(error);
          } finally {
            setLoading(false);
            searchTermRef.current = searchTerm;
          }

          break;
        case false:
          try {
            setLoading(true);
            const res = await fetchAddressesTextSearch(searchTerm);
            const resultz = res?.data?.features;
            const houseNum = res?.data?.query?.parsed?.housenumber;
            setResults(resultz?.length ? resultz : []);
            setHouseNumber(houseNum || '');
            handleShow();
            setSearchType(SEARCH_TYPES.ADDRESS);
          } catch (error) {
            setResults([]);
            setHouseNumber('');
            console.error(error);
          } finally {
            setLoading(false);
            searchTermRef.current = searchTerm;
          }
          break;
        default:
          break;
      }
    }
  }, [searchTerm]);

  const handleOnSelectPostcode = useCallback(
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

  const handleOnSelectAddress = useCallback(
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
          InputProps={{
            autoComplete: 'new-password',
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
          label={'Quickly search by Postcode or Address'}
          placeholder="e.g M1 3NF or 21 Burton Street"
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
            searchType === SEARCH_TYPES.POSTCODE ? (
              results.map((result) => {
                const formatted = result.formatted_text;
                return (
                  <MenuItem
                    key={formatted}
                    onClick={(e) => {
                      e.preventDefault();
                      handleOnSelectPostcode(result);
                    }}
                  >
                    {`${formatted}`}
                  </MenuItem>
                );
              })
            ) : (
              results.map((result) => {
                const formatted = result?.properties?.formatted;
                const houseNum =
                  formatted.split(' ')[0] === houseNumber ? '' : houseNumber;
                return (
                  <MenuItem
                    key={result?.properties?.place_id}
                    onClick={(e) => {
                      e.preventDefault();
                      handleOnSelectAddress(result.properties);
                    }}
                  >
                    {`${houseNum} ${result?.properties?.formatted}`}
                  </MenuItem>
                );
              })
            )
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

AddressAutocomplete.propTypes = {
  handleOnAddressSelect: PropTypes.func
};

export default AddressAutocomplete;
