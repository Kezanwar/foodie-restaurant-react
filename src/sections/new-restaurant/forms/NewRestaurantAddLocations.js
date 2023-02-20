import React, { useEffect, useMemo } from 'react';
import { m } from 'framer-motion';
import {
  Alert,
  AlertTitle,
  Autocomplete,
  Box,
  Button,
  Chip,
  duration,
  Stack,
  TextField
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import StoreIcon from '@mui/icons-material/Store';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import Subheader from '../../../components/subheader/Subheader';
import {
  FormSectionStack,
  InputWithInfoInfoContainer,
  InputWithInfoInputContainer,
  InputWithInfoStack
} from '../styles';
import { RHFCheckbox, RHFTextField } from '../../../components/hook-form';
import useCustomMediaQueries from '../../../hooks/useCustomMediaQueries';
import { countries, countryToFlag } from '../../../assets/data';

import RouterLink from '../../../components/router-link/RouterLink';
import { pageScrollToTop } from '../../../utils/scroll';
import { varFade } from '../../../components/animate';

const NewRestaurantAddLocations = (props) => {
  const { getValues, trigger, getFieldState, setValue, resetField, watch } =
    useFormContext();
  useEffect(() => {
    pageScrollToTop();
  }, []);

  const onAddLocationClick = async () => {
    await setValue('is_new_location', true);
    await trigger('add_location');
    const err = !!getFieldState('add_location').error;
    if (err) return;
    const locations = getValues('locations');
    const newLocation = getValues('add_location');
    const newLocationsArray = [...locations, newLocation];
    await setValue('locations', newLocationsArray);
    await resetField('add_location');
  };

  const locations = watch('locations');
  return (
    <m.div variants={varFade().in}>
      <Subheader
        sx={{ padding: 0, marginBottom: 16 }}
        text={'Add Restaurant location/s (Minimum 1 required)'}
      />

      <InputWithInfoStack>
        <InputWithInfoInputContainer>
          {/* <Box mb={2}>
            <RHFCheckbox
              name="add_location_use_company"
              label="Skip this until later (Must have atleast one location before "
            />
          </Box> */}

          <>
            <Box mb={2}>
              <RHFTextField
                name="add_location.address_line_1"
                label="Address line 1"
              />
            </Box>
            <Box mb={2}>
              <RHFTextField
                name="add_location.address_line_2"
                label="Address line 2 (Optional)"
              />
            </Box>
            <Box mb={2}>
              <RHFTextField name="add_location.postcode" label="Postcode" />
            </Box>
            <Box mb={2}>
              <RHFTextField name="add_location.city" label="City" />
            </Box>
            <Box mb={2}>
              <Autocomplete
                fullWidth
                autoHighlight
                options={countries}
                getOptionLabel={(option) => option.label}
                //   inputValue={country}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    value={option.label}
                    {...props}
                    sx={{ px: '8px !important' }}
                  >
                    <Box
                      component="span"
                      sx={{ flexShrink: 0, mr: 2, fontSize: 22 }}
                    >
                      {countryToFlag(option.code)}
                    </Box>
                    {option.label} ({option.code}) +{option.phone}
                    <input value={option.label} style={{ display: 'none' }} />
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    label={'Country'}
                    {...params}
                    inputProps={{
                      ...params.inputProps
                    }}
                    // ref={countryRef}
                    // onBlur={(e) => updateCountry(e.target.value)}
                    // onChange={(e) => updateCountry(e.target.value)}
                  />
                )}
              />
            </Box>
            <Box mb={2}>
              <RHFTextField name="add_location.email" label="E-mail address" />
            </Box>
            <Box mb={2}>
              <RHFTextField
                name="add_location.phone_number"
                label="Contact number"
              />
            </Box>
            <Box mb={2}>
              <RHFTextField name="add_location.nickname" label="Nickname" />
            </Box>
            <Stack alignItems={'flex-end'} mb={2}>
              <Button
                // sx={{ display: 'flex', alignItems: 'center' }}
                onClick={onAddLocationClick}
                variant="outlined"
              >
                Add Location
                {/* <Box
                  display={'flex'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  ml={2}
                >
                  +
                </Box> */}
              </Button>
            </Stack>
          </>
        </InputWithInfoInputContainer>
        <InputWithInfoInfoContainer>
          <Alert icon={<HelpIcon />} severity={'success'}>
            <AlertTitle>How do locations work?</AlertTitle>
            Your Restaurant can have one or multiple locations, when creating a
            voucher you can choose which location the voucher can be used at.
            <Box mt={1}>
              We list your location on the map with your Restaurants name and
              nickname in brackets after,{' '}
              <strong>e.g - Nandos (Trafford Centre)</strong>
            </Box>
            <Box mt={1}>
              If you only have one location, the nickname will not be shown.
            </Box>
            {/* <Box mt={1}>
              This in turn helps us show vouchers within the customers desired
              radius on the mobile app.
            </Box> */}
            <Box mt={1}>
              Location details include;
              <Box mt={1}>
                <li>Address</li>
                <li>Email Address</li>
                <li>Contact Number</li>
                <li>Nickname</li>
              </Box>{' '}
            </Box>
            <Box mt={1}>
              Locations can be added, updated or removed{' '}
              <strong>at any time.</strong>
            </Box>
          </Alert>
        </InputWithInfoInfoContainer>
      </InputWithInfoStack>
      {locations.length ? (
        <Stack mt={4} flexDirection={'row'} gap={2}>
          {locations.map((location, index) => {
            const {
              address_line_1,
              address_line_2,
              postcode,
              city,
              country,
              email,
              phone_number,
              nickname
            } = location;
            return (
              // <Box
              //   sx={{ border: '1px solid' }}
              //   // severity={'warning'}
              // >
              //   {Object.values(location).map((v) => (
              //     <Box mt={1}>{v}</Box>
              //   ))}
              // </Box>
              <Chip
                sx={{ width: 'max-content' }}
                key={index + address_line_1}
                label={`${nickname} - ${address_line_1}, ${postcode}, ${city}`}
                variant="outlined"
                // clickable
                color="success"
                onDelete={() => {}}
                // icon={<StoreIcon />}
                // avatar={<StoreIcon back />}
              />
            );
          })}
        </Stack>
      ) : (
        ''
      )}
    </m.div>
  );
};

NewRestaurantAddLocations.propTypes = {};

export default NewRestaurantAddLocations;
