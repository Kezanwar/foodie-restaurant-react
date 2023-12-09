import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { useSnackbar } from 'notistack';

import {
  Alert,
  Box,
  Button,
  Container,
  Stack,
  Typography,
  useTheme
} from '@mui/material';
import { capitalize } from 'lodash';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';

import { DashboardTitleContainer } from '../styles';
import DashboardTitle from '../../../components/dashboard-title/DashboardTitle';

import LoadingScreen from '../../../components/loading-screen/LoadingScreen';
import FormProvider from '../../../components/hook-form/FormProvider';
import Subheader from '../../../components/subheader/Subheader';
import {
  InputStack,
  InputStackSingleItemContainer
} from '../../../features/forms/styles';
import AddressAutocomplete from '../../../components/address-autocomplete/AddressAutocomplete';
import { RHFTextField } from '../../../components/hook-form';
import Spacer from '../../../components/spacer/Spacer';
import RHFCountriesAutocomplete from '../../../components/hook-form/RHFCountriesAutocomplete';
import OpeningTimeInput from '../../../components/opening-time-input/OpeningTimeInput';

import useOpeningTimesForm from '../../../hooks/useOpeningTimesForm';
import useRestaurantQuery from '../../../hooks/queries/useRestaurantQuery';
import useLocationsQuery from '../../../hooks/queries/useLocationsQuery';
import useCustomMediaQueries from '../../../hooks/useCustomMediaQueries';

import {
  addLocationsDashboardSchema,
  addLocationsSchema
} from '../../../validation/new-restaurant';
import { countries } from '../../../assets/data';
import ConfirmLocationModal from '../../../components/confirm-location-modal/ConfirmLocationModal';
import { LocationsTopAlert } from '../../new-restaurant/NewRestaurantAddLocations';
import { addLocation, checkLocation } from '../../../utils/api';
import { MIXPANEL_EVENTS, mixpanelTrack } from '../../../utils/mixpanel';
import ConfirmLocationModalDashboard from '../../../components/confirm-location-modal/ConfirmLocationModalDashboard';
import { PATH_DASHBOARD } from '../../../routes/paths';

const LocationsAdd = (props) => {
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [addLocationModalOpen, setAddLocationModalOpen] = useState(false);
  const [addLocationLoading, setAddLocationLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const [mapPosition, setMapPosition] = useState({
    lat: 53.41728238865921,
    lng: -2.235525662503866
  });

  const resQuery = useRestaurantQuery();
  const { data, isLoading, updateQuery } = useLocationsQuery();

  const { isTablet, isMobile } = useCustomMediaQueries();

  const navigate = useNavigate();

  const theme = useTheme();

  const restaurant = resQuery?.data?.data;

  const restLoading = resQuery?.isLoading;

  const {
    openingTimes,
    resetOpeningTimes,
    updateOpeningTimes,
    replaceOpeningTimes
  } = useOpeningTimesForm();

  const defaultValues = useMemo(
    () => ({
      address: {
        address_line_1: '',
        address_line_2: '',
        postcode: '',
        city: '',
        country: countries.find((el) => el.label === 'United Kingdom')
      },

      email: '',
      phone_number: '',
      nickname: ''
    }),
    [data?.data]
  );

  const methods = useForm({
    resolver: yupResolver(addLocationsDashboardSchema),
    defaultValues
  });

  const {
    watch,
    trigger,
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    getValues,
    getFieldState,
    setValue
  } = methods;

  const scrollToForm = useCallback(() => {
    window.scrollTo({
      top: 450,
      left: 0,
      behavior: 'smooth'
    });
  }, []);

  const onSubmit = useCallback(async () => {
    setAddLocationLoading(true);
    await trigger();
    const err = !!getFieldState().error;
    if (err) {
      scrollToForm();
      setAddLocationLoading(false);
      return;
    }

    const d = getValues();

    const newLocation = {
      ...d,
      opening_times: openingTimes,
      address: { ...d.address, country: d.address.country.label }
    };

    try {
      const res = await checkLocation(newLocation);
      const data = res?.data;

      if (data) {
        setMapPosition({
          lng: data?.long_lat?.long,
          lat: data?.long_lat?.lat
        });
        setAddLocationModalOpen(true);
        mixpanelTrack(MIXPANEL_EVENTS.check_location_success);
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(`${error?.message || 'Unexpected error occured'}`, {
        variant: 'error'
      });
      setAddLocationLoading(false);
      mixpanelTrack(MIXPANEL_EVENTS.check_location_failed, {
        error: error?.message
      });
    }
  }, [openingTimes]);

  const resetForm = () => {
    reset();
    resetOpeningTimes();
    scrollToForm();
  };

  const onConfirmLocation = useCallback(
    async (long_lat) => {
      const d = getValues();
      const newLocation = {
        ...d,
        opening_times: openingTimes,
        address: { ...d.address, country: d?.address?.country?.label },
        long_lat
      };

      setFormSubmitLoading(true);
      try {
        const res = await addLocation(newLocation);
        const data = res?.data;

        updateQuery(data);
        setAddLocationModalOpen(false);
        setFormSubmitLoading(false);
        setAddLocationLoading(false);
        mixpanelTrack(MIXPANEL_EVENTS.add_location_success);
        enqueueSnackbar(
          `${res?.data?.nickname || 'Location'} added successfully`
        );
        navigate(PATH_DASHBOARD.locations);
      } catch (error) {
        enqueueSnackbar(`${error?.message || 'Unexpected error occured'}`, {
          variant: 'error'
        });
        mixpanelTrack(MIXPANEL_EVENTS.add_location_failed, {
          error: error?.message
        });
        setAddLocationModalOpen(false);
        setFormSubmitLoading(false);
        setAddLocationLoading(false);
        console.error(error);
      }
    },
    [openingTimes]
  );

  const handleOnAddressSelect = (address) => {
    const { address_line_1, address_line_2, postcode, city, country } = address;

    Object.entries({
      address_line_1,
      address_line_2,
      postcode,
      city,
      country
    }).forEach(([key, value]) => {
      setValue(`address.${key}`, value);
    });
  };

  const onCancelLocationModal = () => {
    setAddLocationModalOpen(false);
    setAddLocationLoading(false);
  };

  const onError = useCallback((errors) => {
    const errArr = Object.entries(errors);
    errArr.forEach(([name, value]) =>
      value?.message
        ? enqueueSnackbar(value.message, { variant: 'error' })
        : null
    );

    const data = { ...errors };

    mixpanelTrack(MIXPANEL_EVENTS.create_restaurant_add_locations_errors, {
      errors: data
    });
  }, []);

  if (restLoading || isLoading) return <LoadingScreen />;
  return (
    <>
      <Helmet>
        <title> Add Location | Foodie</title>
      </Helmet>

      <Container sx={{ px: 3, pb: 4 }} maxWidth={'xl'}>
        <DashboardTitleContainer>
          <DashboardTitle title={'Add A Location'} />
          <Typography mb={2} variant="body2" color={'text.secondary'}>
            Add a location using the form below.
          </Typography>
        </DashboardTitleContainer>
        <LocationsTopAlert />
        <FormProvider
          methods={methods}
          onSubmit={handleSubmit(onSubmit, onError)}
          autoComplete={false}
        >
          <Subheader text={'Add Location Address'} />
          <InputStackSingleItemContainer>
            <AddressAutocomplete
              handleOnAddressSelect={handleOnAddressSelect}
            />
          </InputStackSingleItemContainer>
          <Box sx={{ mt: 3.5, mb: 3 }}>
            <Typography variant="body2" color={'primary'}>
              Or enter an address manually...
            </Typography>
          </Box>

          <InputStack>
            <RHFTextField
              autoComplete={false}
              variant={'filled'}
              name="address.address_line_1"
              placeholder={'e.g 23 Red Baloon Street'}
              label="Address line 1"
            />
            <RHFTextField
              autoComplete={false}
              variant={'filled'}
              name="address.address_line_2"
              placeholder={'e.g Didsbury'}
              label="Address line 2 (Optional)"
            />
          </InputStack>
          <InputStack>
            <RHFTextField
              autoComplete={false}
              variant={'filled'}
              name="address.postcode"
              label="Postcode"
              placeholder={'e.g M20 2FG'}
            />
            <RHFTextField
              autoComplete={false}
              variant={'filled'}
              name="address.city"
              label="City"
              placeholder={'e.g Manchester'}
            />
          </InputStack>
          <InputStack>
            <RHFCountriesAutocomplete name={'address.country'} />
            <Box />
          </InputStack>
          <Spacer sp={6} />
          <Subheader text={'Location Contact Details'} />
          <InputStack>
            <RHFTextField
              autoComplete={false}
              variant={'filled'}
              name="email"
              label="E-mail address"
              placeholder={'e.g your@email.com'}
            />
            <RHFTextField
              autoComplete={false}
              variant={'filled'}
              name="phone_number"
              placeholder={'e.g 07917620399'}
              label="Contact number"
            />
          </InputStack>
          <Spacer sp={6} />
          <Subheader text={'Location Nickname'} />

          <InputStack>
            <RHFTextField
              autoComplete={false}
              variant={'filled'}
              name="nickname"
              placeholder={'e.g Ancoats NQ'}
              label="Nickname"
            />
            <Box />
          </InputStack>
          <Spacer sp={6} />
          <Subheader
            sx={{ marginBottom: 20 }}
            text={'Location Opening Times'}
          />
          <Box
            width={!isTablet ? `calc(50% - ${theme.spacing(1.5)})` : '100%'}
            mb={2}
          >
            {Object.entries(openingTimes).map(([key, value]) => {
              return (
                <OpeningTimeInput
                  key={`opening-times-form-${key}`}
                  name={capitalize(key)}
                  value={value}
                  setIsOpen={() =>
                    updateOpeningTimes(
                      key,
                      'is_open',
                      !openingTimes[key].is_open
                    )
                  }
                  onCloseChange={(value) =>
                    updateOpeningTimes(key, 'close', value)
                  }
                  onOpenChange={(value) =>
                    updateOpeningTimes(key, 'open', value)
                  }
                />
              );
            })}
            {/* ACTIONS */}
            <Box
              mt={6}
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <Button
                sx={{ mr: 2 }}
                color="inherit"
                onClick={resetForm}
                variant="outlined"
              >
                Reset form
              </Button>
              <LoadingButton
                loading={addLocationLoading}
                type="submit"
                variant="contained"
              >
                Add Location
              </LoadingButton>
            </Box>
          </Box>

          {addLocationModalOpen && (
            <ConfirmLocationModalDashboard
              mapPosition={mapPosition}
              onCancel={onCancelLocationModal}
              onSubmit={onConfirmLocation}
              submitLoading={formSubmitLoading}
              isOpen={addLocationModalOpen}
              openingTimes={openingTimes}
            />
          )}
        </FormProvider>
      </Container>
    </>
  );
};

LocationsAdd.propTypes = {};

export default LocationsAdd;
