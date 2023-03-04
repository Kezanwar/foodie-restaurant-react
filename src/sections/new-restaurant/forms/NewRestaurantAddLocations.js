import React, { Fragment, useEffect, useMemo } from 'react';
import { capitalize } from 'lodash';
import { LoadingButton } from '@mui/lab';
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
  TextField,
  Typography
} from '@mui/material';
import { useTheme } from '@emotion/react';
import HelpIcon from '@mui/icons-material/Help';
import StoreIcon from '@mui/icons-material/Store';
import PropTypes from 'prop-types';
import { useFormContext, useWatch } from 'react-hook-form';
import Subheader from '../../../components/subheader/Subheader';
import {
  CanDisableInputContainer,
  FormSectionStack,
  InputStack,
  InputStackSingleItemContainer,
  InputWithInfoInfoContainer,
  InputWithInfoInputContainer,
  InputWithInfoStack
} from '../styles';
import {
  RHFCheckbox,
  RHFSelect,
  RHFTextField
} from '../../../components/hook-form';
import useCustomMediaQueries from '../../../hooks/useCustomMediaQueries';
import { countries, countryToFlag } from '../../../assets/data';

import RouterLink from '../../../components/router-link/RouterLink';
import { pageScrollToTop } from '../../../utils/scroll';
import { MotionContainer, varFade } from '../../../components/animate';
import LocationCard from '../../../components/location-card/LocationCard';
import { OPENING_TIMES_OPTIONS } from '../../../constants/utils.constants';
import { LocationCardsContainer } from '../../../components/location-card/styles';
import Spacer from '../../../components/spacer/Spacer';

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
    if (err) {
      window.scrollTo({
        top: 450,
        left: 0,
        behavior: 'smooth'
      });
      await setValue('is_new_location', false);
      return;
    }
    const locations = getValues('locations');
    const opening_times = getValues('add_opening_times');
    const newLocation = { ...getValues('add_location'), opening_times };
    const newLocationsArray = [...locations, newLocation];
    await setValue('locations', newLocationsArray);
    await resetField('add_location');
    await setValue('is_new_location', false);
  };

  const onLocationDelete = async (index) => {
    const locations = await getValues('locations');
    const l = [...locations];
    l.splice(index, 1);
    setTimeout(async () => {
      await setValue('locations', l);
    }, 200);
  };

  const locations = watch('locations');

  const opening_times = getValues('add_opening_times');
  useWatch('add_opening_times.mon');
  useWatch('add_opening_times.tue');
  useWatch('add_opening_times.wed');
  useWatch('add_opening_times.thu');
  useWatch('add_opening_times.fri');
  useWatch('add_opening_times.sat');
  useWatch('add_opening_times.sun');

  const theme = useTheme();

  const updateCountry = (val) => {
    setValue('add_location.country', val);
  };

  const { isTablet, isMobile } = useCustomMediaQueries();
  return (
    <m.div variants={varFade().in}>
      <Box mb={6}>
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
              <li>Opening Times</li>
            </Box>{' '}
          </Box>
          <Box mt={1}>
            Locations can be added, updated or removed{' '}
            <strong>at any time.</strong>
          </Box>
        </Alert>
      </Box>
      <Typography mb={6} variant="h4">
        Add a single or multiple location/s (Minimum 1 required)
      </Typography>
      <Subheader
        sx={{ padding: 0, marginBottom: 16 }}
        text={'Location Address'}
      />

      <InputStack>
        <RHFTextField
          variant={'filled'}
          name="add_location.address_line_1"
          label="Address line 1"
        />
        <RHFTextField
          variant={'filled'}
          name="add_location.address_line_2"
          label="Address line 2 (Optional)"
        />
      </InputStack>
      <InputStack>
        <RHFTextField
          variant={'filled'}
          name="add_location.postcode"
          label="Postcode"
        />
        <RHFTextField
          variant={'filled'}
          name="add_location.city"
          label="City"
        />
      </InputStack>
      <InputStack>
        <Autocomplete
          fullWidth
          autoHighlight
          options={countries}
          getOptionLabel={(option) => option.label}
          //   inputValue={country}
          defaultValue={countries.find((c) => c.label === 'United Kingdom')}
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
              <input value={option.label} style={{ display: 'none' }} />
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              variant={'filled'}
              label={'Country'}
              {...params}
              inputProps={{
                ...params.inputProps,
                autoComplete: 'disabled'
              }}
              // ref={countryRef}
              defaultValue={'United Kingdom'}
              onBlur={(e) => updateCountry(e.target.value)}
              onChange={(e) => updateCountry(e.target.value)}
            />
          )}
        />
        <Box />
      </InputStack>
      <Spacer />
      <Subheader
        sx={{ padding: 0, marginBottom: 16 }}
        text={'Location Contact Details'}
      />
      <InputStack>
        <RHFTextField
          variant={'filled'}
          name="add_location.email"
          label="E-mail address"
        />
        <RHFTextField
          variant={'filled'}
          name="add_location.phone_number"
          label="Contact number"
        />
      </InputStack>
      <Spacer />
      <Subheader
        sx={{ padding: 0, marginBottom: 16 }}
        text={'Add Location Nickname'}
      />

      <InputStack>
        <RHFTextField
          variant={'filled'}
          name="add_location.nickname"
          label="Nickname"
        />
        <Box />
      </InputStack>
      <Spacer />
      <Subheader
        sx={{ padding: 0, marginBottom: 20 }}
        text={'Add Location Opening Times'}
      />
      <Box
        width={!isTablet ? `calc(50% - ${theme.spacing(1.5)})` : '100%'}
        mb={2}
      >
        {Object.entries(opening_times).map(([key, value]) => {
          const { is_open, open, close } = value;
          return (
            <Fragment key={`opening_input-${key}`}>
              <Stack
                flexDirection={isMobile ? 'column' : 'row'}
                alignItems={isMobile ? 'start' : 'center'}
                gap={isTablet ? 2 : 3}
                mb={4}
              >
                <Stack
                  flexDirection={'row'}
                  alignItems={'center'}
                  mb={isMobile ? 2 : 0}
                >
                  <Box sx={{ width: isTablet ? '70px' : '80px' }}>
                    <RHFCheckbox
                      name={`add_opening_times[${key}].is_open`}
                      label={capitalize(key)}
                    />
                  </Box>

                  <Typography
                    color={is_open ? 'success.main' : 'warning.main'}
                    sx={{
                      marginLeft: 'auto',
                      fontSize: 12,
                      textTransform: 'uppercase',
                      width: '50px',
                      fontWeight: 'bold'
                    }}
                  >
                    {is_open ? 'Open' : 'Closed'}
                  </Typography>
                </Stack>
                <Stack
                  flexDirection={'row'}
                  width={isMobile ? '100%' : ''}
                  gap={isTablet ? 2 : 3}
                  flex={1}
                >
                  <CanDisableInputContainer disabled={!is_open} flex={1}>
                    <RHFSelect
                      variant={'filled'}
                      name={`add_opening_times[${key}].open`}
                      label="Open"
                      defaultValue={'09:00am'}
                    >
                      {is_open ? (
                        <>
                          {OPENING_TIMES_OPTIONS.map((otoption) => {
                            return (
                              <option key={`open-${otoption}`} value={otoption}>
                                {otoption}
                              </option>
                            );
                          })}
                        </>
                      ) : (
                        <option>--</option>
                      )}
                    </RHFSelect>
                  </CanDisableInputContainer>
                  <CanDisableInputContainer disabled={!is_open} flex={1}>
                    <RHFSelect
                      name={`add_opening_times[${key}].close`}
                      label="Close"
                      variant={'filled'}
                      defaultValue={'11:00pm'}
                    >
                      {is_open ? (
                        <>
                          {OPENING_TIMES_OPTIONS.map((otoption) => {
                            return (
                              <option
                                key={`close-${otoption}`}
                                value={otoption}
                              >
                                {otoption}
                              </option>
                            );
                          })}
                        </>
                      ) : (
                        <option>--</option>
                      )}
                    </RHFSelect>
                  </CanDisableInputContainer>
                </Stack>
              </Stack>
              {key !== 'sun' ? (
                <Box
                  mb={4}
                  sx={{
                    width: '100%',
                    height: '1px',
                    backgroundColor: theme.palette.divider
                  }}
                />
              ) : (
                ''
              )}
            </Fragment>
          );
        })}
      </Box>

      <Stack alignItems={'flex-end'} mb={8}>
        <LoadingButton
          // sx={{ display: 'flex', alignItems: 'center' }}
          color="inherit"
          onClick={onAddLocationClick}
          variant="contained"
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
        </LoadingButton>
      </Stack>

      <Subheader
        sx={{ padding: 0, marginBottom: 16 }}
        text={`Your Restaurant Locations (${locations.length})`}
      />
      {locations.length ? (
        <m.div
          style={{
            display: 'flex',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '24px'
          }}
          layout
        >
          {locations
            .map((location, index) => {
              const { address_line_1 } = location;
              return (
                <LocationCard
                  {...location}
                  key={index + address_line_1}
                  onDelete={() => onLocationDelete(index)}
                />
              );
            })
            .reverse()}
        </m.div>
      ) : (
        <Box mb={6}>
          <Alert severity="warning">
            You haven't added any locations yet - use the form above to get
            started. (Minimum 1 required)
          </Alert>
        </Box>
      )}
    </m.div>
  );
};

NewRestaurantAddLocations.propTypes = {};

export default NewRestaurantAddLocations;
