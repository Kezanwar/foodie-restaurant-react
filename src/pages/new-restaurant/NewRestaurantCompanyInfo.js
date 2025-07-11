import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import { Alert, AlertTitle, Button, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/system';
import HelpIcon from '@mui/icons-material/Help';
import { yupResolver } from '@hookform/resolvers/yup';

import Subheader from 'components/subheader/Subheader';
import { RHFTextField } from 'components/hook-form';
import AddressAutocomplete from 'components/address-autocomplete/AddressAutocomplete';
import RHFCountriesAutocomplete from 'components/hook-form/RHFCountriesAutocomplete';
import Spacer from 'components/spacer/Spacer';
import {
  InputStack,
  InputWithInfoInfoContainer,
  InputWithInfoInputContainer,
  InputWithInfoStack
} from 'components/hook-form/styles';
import FormProvider from 'components/hook-form/FormProvider';

import { PATH_NEW_RESTAURANT } from 'routes/paths';

import useCreateRestaurantGuard from 'hooks/useCreateRestaurantGuard';

import useRestaurantQuery from 'hooks/queries/useRestaurantQuery';
import { companyInfoSchema } from 'validation/new-restaurant';
import { countries } from 'assets/data';
import { pageScrollToTop } from 'utils/scroll';
import { MIXPANEL_EVENTS, mixpanelTrack } from 'lib/mixpanel';
import { postCompanyInfo } from 'lib/api';
import useAuthStore from 'stores/auth';

const NewRestaurantCompanyInfo = () => {
  const { data, updateQuery } = useRestaurantQuery();
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const user = useAuthStore((state) => state.user);

  const guard = useCreateRestaurantGuard();

  const restaurant = data?.data;

  useEffect(() => {
    if (restaurant) {
      guard(restaurant, PATH_NEW_RESTAURANT.step_1);
    }
  }, [restaurant, guard]);

  const defaultValues = useMemo(
    () => ({
      // company info
      company_name: restaurant?.company_info?.company_name || '',
      company_number: restaurant?.company_info?.company_number || '',
      company_address: {
        address_line_1:
          restaurant?.company_info?.company_address?.address_line_1 || '',
        address_line_2:
          restaurant?.company_info?.company_address?.address_line_2 || '',
        postcode: restaurant?.company_info?.company_address?.postcode || '',
        city: restaurant?.company_info?.company_address?.city || '',
        country:
          countries.find(
            (el) =>
              el.label === restaurant?.company_info?.company_address?.country
          ) || countries.find((el) => el.label === 'United Kingdom')
      }
    }),
    [
      restaurant?.company_info?.company_name,
      restaurant?.company_info?.company_number,
      restaurant?.company_info?.company_address?.address_line_1,
      restaurant?.company_info?.company_address?.address_line_2,
      restaurant?.company_info?.company_address?.postcode,
      restaurant?.company_info?.company_address?.city,
      restaurant?.company_info?.company_address?.country
    ]
  );

  const methods = useForm({
    resolver: yupResolver(companyInfoSchema),
    defaultValues
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isDirty },
    setValue
  } = methods;

  useEffect(() => {
    pageScrollToTop();
  }, []);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, setValue, reset]);

  const navigate = useNavigate();

  const handleNext = () => {
    navigate(PATH_NEW_RESTAURANT.step_2);
  };

  const handleBack = () => {
    navigate(PATH_NEW_RESTAURANT.new_restaurant);
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
      setValue(`company_address.${key}`, value);
    });
  };

  const onSubmit = async (data) => {
    if (!isDirty) {
      handleNext();
      return;
    }
    try {
      // make dynamic api call
      setFormSubmitLoading(true);
      const updatedRestaurant = await postCompanyInfo({
        ...data,
        company_address: {
          ...data.company_address,
          country: data?.company_address.country?.label
        }
      });
      mixpanelTrack(MIXPANEL_EVENTS.create_restaurant_company_info_success, {
        data
      });
      updateQuery(updatedRestaurant.data);
      handleNext();
    } catch (error) {
      console.error(error);
      mixpanelTrack(MIXPANEL_EVENTS.create_restaurant_company_info_failed, {
        data,
        error: error?.message || JSON.stringify(error)
      });
      setError('afterSubmit', {
        ...error,
        message: error.message
      });
    }
    setFormSubmitLoading(false);
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
      mixpanelTrack(MIXPANEL_EVENTS.create_restaurant_company_info_errors, {
        errors: data
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user?.email, enqueueSnackbar]
  );

  return (
    <Box>
      <Helmet>
        <title> Step 1 | Foodie</title>
      </Helmet>
      <FormProvider
        methods={methods}
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        {/* STEPPER */}
        <Box
          sx={{
            maxWidth: '100vw',
            overflowX: 'auto'
          }}
          mb={6}
        >
          <Subheader text={'Company Information'} />
          <InputStack>
            <RHFTextField
              autoComplete={false}
              variant={'filled'}
              name="company_name"
              label="Registered company name"
              placeholder={'e.g My Restaurant Ltd'}
            />
            <RHFTextField
              autoComplete={false}
              variant={'filled'}
              name="company_number"
              label="Company number"
              placeholder={'e.g 0277767632'}
            />
          </InputStack>
          <Spacer />
          <Subheader text={'Company office address'} />
          <InputWithInfoStack>
            <InputWithInfoInputContainer>
              <Box>
                <AddressAutocomplete
                  handleOnAddressSelect={handleOnAddressSelect}
                />
              </Box>
              <Box
                sx={{
                  mt: 4,
                  mb: 3,
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="body2" color={'primary'}>
                  Or enter an address manually...
                </Typography>
              </Box>

              <>
                <Box my={2}>
                  <RHFTextField
                    autoComplete={false}
                    variant={'filled'}
                    name="company_address.address_line_1"
                    label="Address line 1"
                    placeholder={'e.g 23 Red Baloon Street'}
                  />
                </Box>
                <Box mb={2}>
                  <RHFTextField
                    autoComplete={false}
                    variant={'filled'}
                    name="company_address.address_line_2"
                    label="Address line 2 (Optional)"
                    placeholder={'e.g Didsbury'}
                  />
                </Box>
                <Box mb={2}>
                  <RHFTextField
                    autoComplete={false}
                    variant={'filled'}
                    name="company_address.postcode"
                    label="Post / Zip code"
                    placeholder={'e.g M20 2FG'}
                  />
                </Box>
                <Box mb={2}>
                  <RHFTextField
                    autoComplete={false}
                    variant={'filled'}
                    name="company_address.city"
                    label="City"
                    placeholder={'e.g Manchester'}
                  />
                </Box>
                <Box mb={2}>
                  <RHFCountriesAutocomplete name={'company_address.country'} />
                </Box>
              </>
            </InputWithInfoInputContainer>
            <InputWithInfoInfoContainer>
              <Alert icon={<HelpIcon />} severity={'success'}>
                <AlertTitle>Why do we need this?</AlertTitle>
                We use the information taken on this step to confirm your
                authenticity as a restaurant, thus ensuring a minimum level of
                safety for our customers.
              </Alert>
            </InputWithInfoInfoContainer>
          </InputWithInfoStack>

          {/* ACTIONS */}
          {!!errors.afterSubmit && (
            <Alert severity="error">{errors.afterSubmit.message}</Alert>
          )}

          <Box mt={4} sx={{ display: 'flex' }}>
            <Button color="inherit" onClick={handleBack}>
              Go Back
            </Button>

            <Box sx={{ flexGrow: 1 }} />

            <LoadingButton
              loading={formSubmitLoading}
              type="submit"
              // color={'grey_palette'}
              variant="contained"
            >
              Next
            </LoadingButton>
          </Box>
        </Box>
      </FormProvider>
    </Box>
  );
};

export default NewRestaurantCompanyInfo;
