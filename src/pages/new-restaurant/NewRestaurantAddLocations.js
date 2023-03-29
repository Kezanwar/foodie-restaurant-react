import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { Helmet } from 'react-helmet-async';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';
import { useTheme } from '@emotion/react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import {
  Alert,
  AlertTitle,
  Autocomplete,
  Button,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/system';
import HelpIcon from '@mui/icons-material/Help';
import { yupResolver } from '@hookform/resolvers/yup';

import Subheader from '../../components/subheader/Subheader';
import { RHFTextField } from '../../components/hook-form';

import { countries, countryToFlag } from '../../assets/data';
import { pageScrollToTop } from '../../utils/scroll';
import Spacer from '../../components/spacer/Spacer';
import { InputStack } from '../../sections/forms/styles';

import { addLocationsSchema } from '../../validation/new-restaurant.validation';

import FormProvider from '../../components/hook-form/FormProvider';

import useCustomMediaQueries from '../../hooks/useCustomMediaQueries';

import LocationCard from '../../components/location-card/LocationCard';

import useLocationsQuery from '../../hooks/queries/useLocationsQuery';
import LoadingScreen from '../../components/loading-screen/LoadingScreen';

import { PATH_NEW_RESTAURANT } from '../../routes/paths';
import MotionDivViewport from '../../components/animate/MotionDivViewport';
import { RHFOpeningTime } from '../../components/hook-form/RHFOpeningTIme';

import { addLocation, checkLocation, deleteLocation } from '../../utils/api';
import ConfirmLocationModal from '../../components/confirm-location-modal/ConfirmLocationModal';
import AcceptDeclineModal from '../../components/accept-decline-modal/AcceptDeclineModal';

const NewRestaurantAddLocation = (props) => {
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [addLocationLoading, setAddLocationLoading] = useState(false);
  const [confirmLocationLoading, setConfirmLocationLoading] = useState(false);
  const [deleteLocationLoading, setDeleteLocationLoading] = useState(false);
  const [addLocationModalOpen, setAddLocationModalOpen] = useState(false);
  const [deleteLocationModalOpen, setDeleteLocationModalOpen] = useState(false);
  const [mapPosition, setMapPosition] = useState({
    lat: 53.41728238865921,
    lng: -2.235525662503866
  });
  // const [checkLocation, setCheckLocation] = useState(null);

  const idToDelete = useRef(null);

  const { data, isLoading, updateQuery } = useLocationsQuery();
  const defaultValues = useMemo(
    () => ({
      locations: data?.data || [],
      is_new_location: false,
      add_location: {
        address: {
          address_line_1: '',
          address_line_2: '',
          postcode: '',
          city: '',
          country: 'United Kingdom'
        },

        email: '',
        phone_number: '',
        nickname: ''
      },
      add_opening_times: {
        mon: { is_open: true, open: '10:00 AM', close: '11:00 PM' },
        tue: { is_open: true, open: '10:00 AM', close: '11:00 PM' },
        wed: { is_open: true, open: '10:00 AM', close: '11:00 PM' },
        thu: { is_open: true, open: '10:00 AM', close: '11:00 PM' },
        fri: { is_open: true, open: '10:00 AM', close: '11:00 PM' },
        sat: { is_open: true, open: '10:00 AM', close: '11:00 PM' },
        sun: { is_open: true, open: '10:00 AM', close: '11:00 PM' }
      }
    }),
    [data?.data]
  );

  const navigate = useNavigate();

  const methods = useForm({
    resolver: yupResolver(addLocationsSchema),
    defaultValues
  });

  const {
    watch,
    trigger,
    resetField,
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    getValues,
    getFieldState,
    setValue
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, setValue]);

  const handleNext = () => {
    setMapPosition([52.41728238865921, -1.235525662503866]);
  };

  const handleBack = () => {
    navigate(PATH_NEW_RESTAURANT.step_2);
  };

  const onSubmit = async (data) => {
    try {
      // make dynamic api call
      setFormSubmitLoading(true);
      // await FORM_STEPS[activeStep].API_CALL(data);
      handleNext();
    } catch (error) {
      console.error(error);
      // reset();
      setError('afterSubmit', {
        ...error,
        message: error.message
      });
    }
    setFormSubmitLoading(false);
  };

  const { isTablet, isMobile } = useCustomMediaQueries();

  useEffect(() => {
    pageScrollToTop();
  }, []);

  const onAddLocationClick = useCallback(async () => {
    setAddLocationLoading(true);
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
      setAddLocationLoading(false);
      return;
    }

    const opening_times = getValues('add_opening_times');
    const newLocation = { ...getValues('add_location'), opening_times };

    try {
      const res = await checkLocation(newLocation);
      const data = res?.data;
      if (data) {
        setMapPosition({
          lng: data?.long_lat?.long,
          lat: data?.long_lat?.lat
        });
        setAddLocationModalOpen(true);
      }
    } catch (error) {
      console.error(error);
      setError('afterSubmit', {
        ...error,
        message: error.message
      });
      setAddLocationLoading(false);
    }
  }, []);

  const onConfirmLocation = useCallback(async (long_lat) => {
    const opening_times = getValues('add_opening_times');
    const newLocation = {
      ...getValues('add_location'),
      opening_times,
      long_lat
    };
    setConfirmLocationLoading(true);
    try {
      const res = await addLocation(newLocation);
      const data = res?.data;

      updateQuery(data);
      setAddLocationModalOpen(false);
      setConfirmLocationLoading(false);
      setAddLocationLoading(false);
    } catch (error) {
      setError('afterSubmit', {
        ...error,
        message: error.message
      });
      setAddLocationModalOpen(false);
      setConfirmLocationLoading(false);
      setAddLocationLoading(false);
      console.error(error);
    }
  }, []);

  const onCancelLocationModal = useCallback(() => {
    setAddLocationModalOpen(false);
    setConfirmLocationLoading(false);
    setAddLocationLoading(false);
  }, []);

  const onConfirmLocationDelete = useCallback(async () => {
    try {
      setDeleteLocationLoading(true);
      const res = await deleteLocation(idToDelete.current);
      const data = res?.data;
      updateQuery(data);
      setDeleteLocationLoading(false);
      setDeleteLocationModalOpen(false);
    } catch (error) {
      setError('afterSubmit', {
        ...error,
        message: error.message
      });
      setDeleteLocationLoading(false);
      setDeleteLocationModalOpen(false);
    }
  }, []);

  const onCancelDeleteLocationModal = useCallback(() => {
    setDeleteLocationModalOpen(false);
  }, []);

  const onDeleteLocationClick = useCallback((id) => {
    idToDelete.current = id;
    setDeleteLocationModalOpen(true);
  }, []);

  const updateCountry = (val) => {
    setValue('add_location.country', val);
  };

  const deleteModalText = useMemo(() => {
    if (idToDelete.current) {
      const locations = getValues('locations');
      const l = locations.find((lts) => lts.id === idToDelete.current);
      return `Are you sure you want to delete ${l.nickname}, ${l.address.postcode}?`;
    }
    return '';
  }, [idToDelete.current]);

  const locations = watch('locations');

  const opening_times = useMemo(() => getValues('add_opening_times'), []);

  const theme = useTheme();

  return (
    <>
      <Helmet>
        <title> Step 3 | Foodie</title>
      </Helmet>
      <MotionDivViewport>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box mb={6}>
            <Alert icon={<HelpIcon />} severity={'success'}>
              <AlertTitle>How do locations work?</AlertTitle>
              Your Restaurant can have one or multiple locations, when creating
              a voucher you can choose which location the voucher can be used
              at.
              <Box mt={1}>
                We list your location on the users feed with your Restaurants
                name and nickname in brackets after,{' '}
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
              name="add_location.address.address_line_1"
              label="Address line 1"
            />
            <RHFTextField
              variant={'filled'}
              name="add_location.address.address_line_2"
              label="Address line 2 (Optional)"
            />
          </InputStack>
          <InputStack>
            <RHFTextField
              variant={'filled'}
              name="add_location.address.postcode"
              label="Postcode"
            />
            <RHFTextField
              variant={'filled'}
              name="add_location.address.city"
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
          <Spacer sp={6} />
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
          <Spacer sp={6} />
          <Subheader
            sx={{ padding: 0, marginBottom: 16 }}
            text={'Location Nickname'}
          />

          <InputStack>
            <RHFTextField
              variant={'filled'}
              name="add_location.nickname"
              label="Nickname"
            />
            <Box />
          </InputStack>
          <Spacer sp={6} />
          <Subheader
            sx={{ padding: 0, marginBottom: 20 }}
            text={'Location Opening Times'}
          />
          <Box
            width={!isTablet ? `calc(50% - ${theme.spacing(1.5)})` : '100%'}
            mb={2}
          >
            {Object.entries(opening_times).map(([key, value]) => {
              return (
                <RHFOpeningTime
                  key={`rhf-${key}`}
                  name={`add_opening_times.${key}`}
                />
              );
            })}
          </Box>

          <Stack alignItems={'flex-end'} mb={8}>
            <Stack alignItems={'flex-end'}>
              <LoadingButton
                loading={addLocationLoading}
                color="inherit"
                onClick={onAddLocationClick}
                variant="contained"
              >
                Add Location
              </LoadingButton>
              {!!errors.afterSubmit && (
                <>
                  <Spacer />
                  <Alert severity="error">{errors.afterSubmit.message}</Alert>
                </>
              )}
            </Stack>
          </Stack>

          <Subheader
            sx={{ padding: 0, marginBottom: 16 }}
            text={`Your Restaurant Locations (${locations.length})`}
          />
          {locations.length ? (
            <MotionDivViewport
              key={'loctions-container'}
              layout
              style={{
                display: 'flex',
                marginBottom: '32px',
                flexWrap: 'wrap',
                gap: '24px'
              }}
            >
              {locations
                .map((location, index) => {
                  return (
                    <LocationCard
                      {...location}
                      key={location.id}
                      onDelete={onDeleteLocationClick}
                    />
                  );
                })
                .reverse()}
            </MotionDivViewport>
          ) : (
            <Box mb={6}>
              <Alert severity="error">
                You haven't added any locations yet - use the form above to get
                started. (Minimum 1 required)
              </Alert>
            </Box>
          )}
          {/* ACTIONS */}
          <Box mt={4} sx={{ display: 'flex' }}>
            <Button color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              color="inherit"
              onClick={() => console.log(getValues())}
              sx={{ mr: 1 }}
            >
              vals
            </Button>
            <LoadingButton
              loading={formSubmitLoading}
              type="submit"
              // color={'grey_palette'}
              variant="contained"
            >
              Next
            </LoadingButton>
          </Box>
          {addLocationModalOpen && (
            <ConfirmLocationModal
              mapPosition={mapPosition}
              onCancel={onCancelLocationModal}
              onSubmit={onConfirmLocation}
              submitLoading={confirmLocationLoading}
              isOpen={addLocationModalOpen}
            />
          )}
          {deleteLocationModalOpen && (
            <AcceptDeclineModal
              title={'Confirm delete location'}
              subtitle={deleteModalText}
              isOpen={deleteLocationModalOpen}
              submitLoading={deleteLocationLoading}
              onCancel={onCancelDeleteLocationModal}
              onAccept={onConfirmLocationDelete}
            />
          )}
        </FormProvider>
      </MotionDivViewport>
    </>
  );
};

NewRestaurantAddLocation.propTypes = {};

export default React.memo(NewRestaurantAddLocation);
