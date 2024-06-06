/* eslint-disable react/prop-types */
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { useSnackbar } from 'notistack';
import { Helmet } from 'react-helmet-async';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router';

import { useTheme } from '@emotion/react';
import EditIcon from '@mui/icons-material/Edit';
import { Alert, AlertTitle, Button, Stack, Typography } from '@mui/material';
import { capitalize } from 'lodash';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/system';
import HelpIcon from '@mui/icons-material/Help';
import { yupResolver } from '@hookform/resolvers/yup';

import Subheader from '../../components/subheader/Subheader';
import { RHFTextField } from '../../components/hook-form';

import { countries } from '../../assets/data';
import { pageScrollToTop } from '../../utils/scroll';
import Spacer from '../../components/spacer/Spacer';
import {
  InputStack,
  InputStackSingleItemContainer
} from '../../components/hook-form/styles';

import { addLocationsSchema } from '../../validation/new-restaurant';
import FormProvider from '../../components/hook-form/FormProvider';
import useCustomMediaQueries from '../../hooks/useCustomMediaQueries';
import LocationCard from '../../components/location-card/LocationCard';
import useLocationsQuery from '../../hooks/queries/useLocationsQuery';
import { PATH_NEW_RESTAURANT } from '../../routes/paths';
import MotionDivViewport from '../../components/animate/MotionDivViewport';

import {
  addLocation,
  checkEditLocation,
  checkLocation,
  deleteLocation,
  editLocation,
  postLocationsStep
} from '../../utils/api';
import ConfirmLocationModal from '../../components/confirm-location-modal/ConfirmLocationModal';
import AcceptDeclineModal from '../../components/accept-decline-modal/AcceptDeclineModal';
import OpeningTimeInput from '../../components/opening-time-input/OpeningTimeInput';
import useOpeningTimesForm from '../../hooks/useOpeningTimesForm';
import useRestaurantQuery from '../../hooks/queries/useRestaurantQuery';
import useCreateRestaurantGuard from '../../hooks/useCreateRestaurantGuard';

import { MIXPANEL_EVENTS, mixpanelTrack } from '../../utils/mixpanel';
import { useAuthContext } from '../../hooks/useAuthContext';
import RHFCountriesAutocomplete from '../../components/hook-form/RHFCountriesAutocomplete';
import AddressAutocomplete from '../../components/address-autocomplete/AddressAutocomplete';

const motionStyles = {
  display: 'flex',
  marginBottom: '32px',
  flexWrap: 'wrap',
  gap: '24px'
};

export const LocationsTopAlert = () => {
  return (
    <Box mb={6}>
      <Alert icon={<HelpIcon />} severity={'success'}>
        <AlertTitle>How do locations work?</AlertTitle>
        Your Restaurant can have one or multiple locations, when creating a deal
        you can choose which location the deal can be used at.
        <Box mt={1}>
          We list your location on the users feed with your Restaurants name and
          nickname in brackets after,{' '}
          <strong>e.g - Nandos (Trafford Centre)</strong>
        </Box>
        <Box mt={1}>
          If you only have one location, the nickname will not be shown.
        </Box>
        <Box mt={1}>
          This in turn helps us{' '}
          <strong>show deals to customers in your local area.</strong>
        </Box>
        <Box mt={1}>
          Location details include;
          <Box mt={1}>
            <li>Address</li>
            <li>Email Address</li>
            <li>Contact Number</li>
            <li>Nickname</li>
            <li>Opening Times</li>
          </Box>
        </Box>
        <Box mt={1}>
          Locations can be added, updated or removed{' '}
          <strong>at any time.</strong>
        </Box>
      </Alert>
    </Box>
  );
};

const EditAlert = ({ editLocationObj, isTablet }) => {
  return (
    <Alert
      sx={{
        width: isTablet ? '100%' : 'calc(50% - 14px)',
        pr: 4,
        mb: 6
      }}
      icon={<EditIcon fontSize="12px" />}
      severity={'warning'}
    >
      <AlertTitle>Edit location</AlertTitle>
      You're editing: {editLocationObj?.nickname},{' '}
      {editLocationObj?.address?.address_line_1},{' '}
      {editLocationObj?.address?.postcode}
    </Alert>
  );
};

const NewRestaurantAddLocation = () => {
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [addLocationLoading, setAddLocationLoading] = useState(false);
  const [confirmLocationLoading, setConfirmLocationLoading] = useState(false);
  const [deleteLocationLoading, setDeleteLocationLoading] = useState(false);
  const [addLocationModalOpen, setAddLocationModalOpen] = useState(false);
  const [deleteLocationModalOpen, setDeleteLocationModalOpen] = useState(false);
  const [editLocationID, setEditLocationID] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();

  const { data, updateQuery } = useLocationsQuery();

  const restaurantQuery = useRestaurantQuery();

  const editLocationObj = useMemo(() => {
    if (!editLocationID) return null;
    return data?.data?.find((l) => l._id === editLocationID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editLocationID]);

  const [mapPosition, setMapPosition] = useState({
    lat: 53.41728238865921,
    lng: -2.235525662503866
  });

  const {
    openingTimes,
    resetOpeningTimes,
    updateOpeningTimes,
    replaceOpeningTimes
  } = useOpeningTimesForm();

  const guard = useCreateRestaurantGuard();

  const restaurant = restaurantQuery?.data?.data;

  useEffect(() => {
    if (restaurant) {
      guard(restaurant, PATH_NEW_RESTAURANT.step_3);
    }
  }, [restaurant, guard]);

  const idToDelete = useRef(null);

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
          country: countries.find((el) => el.label === 'United Kingdom')
        },

        email: '',
        phone_number: '',
        nickname: ''
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
    reset,
    setError,
    handleSubmit,
    formState: { errors },
    getValues,
    getFieldState,
    setValue
  } = methods;

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues, setValue]);

  const handleBack = () => {
    navigate(PATH_NEW_RESTAURANT.step_2);
  };

  const scrollToForm = () => {
    window.scrollTo({
      top: 450,
      left: 0,
      behavior: 'smooth'
    });
  };

  const onSubmit = async () => {
    try {
      setFormSubmitLoading(true);
      const updatedRestaurant = await postLocationsStep();
      restaurantQuery.updateQuery(updatedRestaurant?.data);
      navigate(PATH_NEW_RESTAURANT.step_4);
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

  const { isTablet } = useCustomMediaQueries();

  useEffect(() => {
    pageScrollToTop();
  }, []);

  const onAddLocationClick = useCallback(async () => {
    setAddLocationLoading(true);
    await setValue('is_new_location', true);
    await trigger('add_location');
    const err = !!getFieldState('add_location').error;
    if (err) {
      scrollToForm();
      await setValue('is_new_location', false);
      setAddLocationLoading(false);
      return;
    }

    const d = getValues('add_location');

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
      setError('afterSubmit', {
        ...error,
        message: error?.message
      });
      setAddLocationLoading(false);
      mixpanelTrack(MIXPANEL_EVENTS.check_location_failed, {
        error: error?.message
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openingTimes]);

  const onSaveEditLocationClick = useCallback(async () => {
    setAddLocationLoading(true);
    await setValue('is_new_location', true);
    await trigger('add_location');
    const err = !!getFieldState('add_location')?.error;
    if (err) {
      scrollToForm();
      await setValue('is_new_location', false);
      setAddLocationLoading(false);
      return;
    }

    const d = getValues('add_location');

    const newLocation = {
      ...d,
      opening_times: openingTimes,
      address: { ...d.address, country: d.address.country.label }
    };

    try {
      const res = await checkEditLocation(newLocation, editLocationID);
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
      setError('afterSubmit', {
        ...error,
        message: error?.message
      });
      setAddLocationLoading(false);
      mixpanelTrack(MIXPANEL_EVENTS.check_location_failed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openingTimes, editLocationID]);

  const onConfirmLocation = useCallback(
    async (long_lat) => {
      const d = getValues('add_location');
      const newLocation = {
        ...d,
        opening_times: openingTimes,
        address: { ...d.address, country: d?.address?.country?.label },
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
        mixpanelTrack(MIXPANEL_EVENTS.add_location_success);
      } catch (error) {
        setError('afterSubmit', {
          ...error,
          message: error?.message
        });
        mixpanelTrack(MIXPANEL_EVENTS.add_location_failed, {
          error: error?.message
        });
        setAddLocationModalOpen(false);
        setConfirmLocationLoading(false);
        setAddLocationLoading(false);
        console.error(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [openingTimes]
  );

  const onConfirmEditLocation = useCallback(
    async (long_lat) => {
      const d = getValues('add_location');
      const newLocation = {
        ...d,
        opening_times: openingTimes,
        address: { ...d.address, country: d?.address?.country?.label },
        long_lat
      };

      setConfirmLocationLoading(true);
      try {
        const res = await editLocation(newLocation, editLocationID);
        const data = res?.data;

        updateQuery(data);
        mixpanelTrack(MIXPANEL_EVENTS.edit_location_success);
        setAddLocationModalOpen(false);
        setConfirmLocationLoading(false);
        setAddLocationLoading(false);
        setEditLocationID(false);
        reset();
      } catch (error) {
        setError('afterSubmit', {
          ...error,
          message: error?.message
        });
        mixpanelTrack(MIXPANEL_EVENTS.edit_location_failed, {
          error: error?.message
        });
        setAddLocationModalOpen(false);
        setConfirmLocationLoading(false);
        setAddLocationLoading(false);

        console.error(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [openingTimes]
  );

  const onCancelLocationModal = () => {
    setAddLocationModalOpen(false);
    setConfirmLocationLoading(false);
    setAddLocationLoading(false);
  };

  const onConfirmLocationDelete = useCallback(async () => {
    try {
      setDeleteLocationLoading(true);
      const res = await deleteLocation(idToDelete.current);
      const data = res?.data;
      updateQuery(data);
      mixpanelTrack(MIXPANEL_EVENTS.delete_location_success);
      setDeleteLocationLoading(false);
      setDeleteLocationModalOpen(false);
    } catch (error) {
      setError('afterSubmit', {
        ...error,
        message: error?.message
      });
      setDeleteLocationLoading(false);
      setDeleteLocationModalOpen(false);
      mixpanelTrack(MIXPANEL_EVENTS.delete_location_failed, {
        error: error?.message
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCancelDeleteLocationModal = () => {
    setDeleteLocationModalOpen(false);
  };

  const onDeleteLocationClick = (_id) => {
    idToDelete.current = _id;
    setDeleteLocationModalOpen(true);
  };

  const onEditLocationClick = (_id) => {
    setEditLocationID(_id);
    const editLocation = data?.data?.find((l) => l._id === _id);
    if (editLocation) {
      const { address, email, phone_number, nickname } = editLocation;
      setValue('add_location', {
        address: {
          ...address,
          country: null
        },
        email,
        phone_number,
        nickname
      });
      setValue(
        'add_location.address.country',
        countries.find((c) => c.label === address.country)
      );
      replaceOpeningTimes(editLocation.opening_times);
      scrollToForm();
    }
  };

  const deleteModalText = useMemo(() => {
    if (idToDelete.current) {
      const locations = getValues('locations');
      const l = locations.find((lts) => lts._id === idToDelete.current);
      return `Are you sure you want to delete ${l?.nickname}, ${l?.address?.postcode}?`;
    }
    return '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idToDelete.current, getValues]);

  const locations = watch('locations');

  const theme = useTheme();

  const resetForm = () => {
    if (setEditLocationID) setEditLocationID(false);
    reset();
    resetOpeningTimes();
    scrollToForm();
  };

  const handleOnAddressSelect = (address) => {
    const { address_line_1, address_line_2, postcode, city, country } = address;

    Object.entries({
      address_line_1,
      address_line_2,
      postcode,
      city,
      country
    }).forEach(([key, value]) => {
      setValue(`add_location.address.${key}`, value);
    });
  };

  const onError = useCallback(
    (errors) => {
      const errArr = Object.entries(errors);
      errArr.forEach(([, value]) =>
        value?.message
          ? enqueueSnackbar(value.message, { variant: 'error' })
          : null
      );

      const data = { ...errors };
      if (user?.email) {
        data.auth = user;
      }
      mixpanelTrack(MIXPANEL_EVENTS.create_restaurant_add_locations_errors, {
        errors: data
      });
    },
    [user?.email]
  );

  return (
    <>
      <Helmet>
        <title> Step 3 | Foodie</title>
      </Helmet>
      <Box>
        <LocationsTopAlert />
        <FormProvider
          methods={methods}
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <Typography mb={6} variant="h4">
            Add a single or multiple location/s (Minimum 1 required)
          </Typography>
          {editLocationObj ? (
            <EditAlert editLocationObj={editLocationObj} isTablet={isTablet} />
          ) : null}
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
              name="add_location.address.address_line_1"
              placeholder={'e.g 23 Red Baloon Street'}
              label="Address line 1"
            />
            <RHFTextField
              autoComplete={false}
              variant={'filled'}
              name="add_location.address.address_line_2"
              placeholder={'e.g Didsbury'}
              label="Address line 2 (Optional)"
            />
          </InputStack>
          <InputStack>
            <RHFTextField
              autoComplete={false}
              variant={'filled'}
              name="add_location.address.postcode"
              label="Postcode"
              placeholder={'e.g M20 2FG'}
            />
            <RHFTextField
              autoComplete={false}
              variant={'filled'}
              name="add_location.address.city"
              label="City"
              placeholder={'e.g Manchester'}
            />
          </InputStack>
          <InputStack>
            <RHFCountriesAutocomplete name={'add_location.address.country'} />
            <Box />
          </InputStack>
          <Spacer sp={6} />
          <Subheader text={'Location Contact Details'} />
          <InputStack>
            <RHFTextField
              autoComplete={false}
              variant={'filled'}
              name="add_location.email"
              label="E-mail address"
              placeholder={'e.g your@email.com'}
            />
            <RHFTextField
              autoComplete={false}
              variant={'filled'}
              name="add_location.phone_number"
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
              name="add_location.nickname"
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
          </Box>

          <Stack alignItems={'flex-end'} mb={8}>
            <Stack alignItems={'flex-end'}>
              {editLocationID ? (
                <Box>
                  <Button
                    sx={{ mr: 2 }}
                    color="inherit"
                    onClick={resetForm}
                    variant="outlined"
                  >
                    Cancel edit
                  </Button>
                  <LoadingButton
                    loading={addLocationLoading}
                    color="primary"
                    onClick={onSaveEditLocationClick}
                    variant="contained"
                  >
                    Save location
                  </LoadingButton>
                </Box>
              ) : (
                <Box>
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
                    color="primary"
                    onClick={onAddLocationClick}
                    variant="contained"
                  >
                    Add Location
                  </LoadingButton>
                </Box>
              )}

              {!!errors.afterSubmit && (
                <>
                  <Spacer />
                  <Alert severity="error">{errors.afterSubmit.message}</Alert>
                </>
              )}
            </Stack>
          </Stack>

          <Subheader text={`Your Restaurant Locations (${locations.length})`} />
          {locations.length ? (
            <MotionDivViewport
              key={'loctions-container'}
              layout
              style={motionStyles}
            >
              {locations
                .map((location, index) => {
                  return (
                    <LocationCard
                      {...location}
                      key={location._id}
                      onEdit={onEditLocationClick}
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
              Go Back
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <LoadingButton
              loading={formSubmitLoading}
              type="submit"
              variant="contained"
            >
              Next
            </LoadingButton>
          </Box>
          {addLocationModalOpen && (
            <ConfirmLocationModal
              mapPosition={mapPosition}
              onCancel={onCancelLocationModal}
              onSubmit={
                editLocationID ? onConfirmEditLocation : onConfirmLocation
              }
              submitLoading={confirmLocationLoading}
              isOpen={addLocationModalOpen}
              openingTimes={openingTimes}
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
      </Box>
    </>
  );
};

NewRestaurantAddLocation.propTypes = {};

export default NewRestaurantAddLocation;
