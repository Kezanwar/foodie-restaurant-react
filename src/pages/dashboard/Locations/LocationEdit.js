import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { Helmet } from 'react-helmet-async';
import { useSnackbar } from 'notistack';
import { Box, Button, Container, Typography, useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';
import { capitalize } from 'lodash';
import { LoadingButton } from '@mui/lab';

import { DashboardTitleContainer } from '../styles';
import DashboardTitle from 'components/dashboard-title/DashboardTitle';
import LoadingScreen from 'components/loading-screen/LoadingScreen';
import { addLocationsDashboardSchema } from 'validation/new-restaurant';
import ConfirmLocationModalDashboard from 'components/confirm-location-modal/ConfirmLocationModalDashboard';
import OpeningTimeInput from 'components/opening-time-input/OpeningTimeInput';
import Subheader from 'components/subheader/Subheader';
import Spacer from 'components/spacer/Spacer';
import { RHFTextField } from 'components/hook-form';
import {
  InputStack,
  InputStackSingleItemContainer
} from 'components/hook-form/styles';
import RHFCountriesAutocomplete from 'components/hook-form/RHFCountriesAutocomplete';
import AddressAutocomplete from 'components/address-autocomplete/AddressAutocomplete';
import FormProvider from 'components/hook-form/FormProvider';

import useRestaurantQuery from 'hooks/queries/useRestaurantQuery';
import useCustomMediaQueries from 'hooks/useCustomMediaQueries';
import useOpeningTimesForm from 'hooks/useOpeningTimesForm';
import { PATH_DASHBOARD } from 'routes/paths';
import { MIXPANEL_EVENTS, mixpanelTrack } from 'utils/mixpanel';
import { checkEditLocation, editLocation } from 'utils/api';
import useLocationsQuery from 'hooks/queries/useLocationsQuery';
import { countries } from 'assets/data';
import Breadcrumbs from 'components/breadcrumbs';

const breadcrumbs = [{ name: 'Locations', link: '/dashboard/locations' }];

const LocationEdit = (props) => {
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [addLocationModalOpen, setAddLocationModalOpen] = useState(false);
  const [addLocationLoading, setAddLocationLoading] = useState(false);
  const [mapPosition, setMapPosition] = useState({
    lat: 53.41728238865921,
    lng: -2.235525662503866
  });

  const locations = useLocationsQuery();
  const { id } = useParams();
  const nav = useNavigate();

  const {
    openingTimes,
    resetOpeningTimes,
    updateOpeningTimes,
    replaceOpeningTimes
  } = useOpeningTimesForm();

  const location = useMemo(() => {
    return locations?.data?.data
      ? locations?.data?.data?.find((l) => l._id === id)
      : null;
  }, [id, locations?.data?.data]);

  useEffect(() => {
    if (locations?.error || !id) nav(PATH_DASHBOARD.locations);
  }, [locations?.error, id]);

  const { enqueueSnackbar } = useSnackbar();

  const resQuery = useRestaurantQuery();

  const { isTablet, isMobile } = useCustomMediaQueries();

  const navigate = useNavigate();

  const theme = useTheme();

  const restaurant = resQuery?.data?.data;

  const restLoading = resQuery?.isLoading;

  const defaultValues = useMemo(
    () => ({
      address: {
        address_line_1: location?.address?.address_line_1 || '',
        address_line_2: location?.address?.address_line_2 || '',
        postcode: location?.address?.postcode || '',
        city: location?.address?.city || '',
        country: location?.address?.country
          ? countries.find((el) => el.label === location?.address?.country)
          : countries.find((el) => el.label === 'United Kingdom')
      },

      email: location?.email,
      phone_number: location?.phone_number,
      nickname: location?.nickname
    }),
    [location]
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

  useEffect(() => {
    if (location) {
      const { address, nickname, email, phone_number } = location;
      const { address_line_1, address_line_2, postcode, city, country } =
        address;

      Object.entries({ nickname, email, phone_number }).forEach(
        ([key, value]) => {
          setValue(key, value);
        }
      );
      Object.entries({
        address_line_1,
        address_line_2,
        postcode,
        city,
        country
      }).forEach(([key, value]) => {
        if (key === 'country') {
          setValue(
            `address.${key}`,
            countries.find((el) => el.label === value)
          );
        } else setValue(`address.${key}`, value);
      });
      replaceOpeningTimes(location?.opening_times);
    }
  }, [location]);

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
      const res = await checkEditLocation(newLocation, id);
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
        const res = await editLocation(newLocation, id);
        const data = res?.data;

        locations.updateQuery(data);
        setAddLocationModalOpen(false);
        setFormSubmitLoading(false);
        setAddLocationLoading(false);
        mixpanelTrack(MIXPANEL_EVENTS.add_location_success);
        enqueueSnackbar('Location updated');
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

    mixpanelTrack(MIXPANEL_EVENTS.edit_location_failed, {
      errors: data
    });
  }, []);

  if (locations?.isLoading) return <LoadingScreen />;

  return (
    <>
      <Helmet>
        <title> Edit Location | Foodie</title>
      </Helmet>

      <Container sx={{ px: 3, pb: 4 }} maxWidth={'xl'}>
        <Breadcrumbs mb={2} current={location.nickname} trail={breadcrumbs} />
        <DashboardTitleContainer>
          <DashboardTitle title={`Edit Location`} />
          <Typography mb={2} variant="body2" color={'text.secondary'}>
            Edit your location using the form below.
          </Typography>
        </DashboardTitleContainer>
        <FormProvider
          methods={methods}
          onSubmit={handleSubmit(onSubmit, onError)}
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
                Save Location
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

LocationEdit.propTypes = {};

export default LocationEdit;
