import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import EastIcon from '@mui/icons-material/East';
import { useSnackbar } from 'notistack';
import { m } from 'framer-motion';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import {
  Alert,
  AlertTitle,
  Autocomplete,
  Button,
  TextField,
  Typography
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/system';
import HelpIcon from '@mui/icons-material/Help';
import { yupResolver } from '@hookform/resolvers/yup';

import Subheader from '../../components/subheader/Subheader';
import { RHFTextField } from '../../components/hook-form';

import { countries, countryToFlag } from '../../assets/data';
import { pageScrollToTop } from '../../utils/scroll';
import { varFade } from '../../components/animate';
import Spacer from '../../components/spacer/Spacer';
import {
  FormSectionStack,
  InputStack,
  InputWithInfoInfoContainer,
  InputWithInfoInputContainer,
  InputWithInfoStack
} from '../../features/forms/styles';

import { companyInfoSchema } from '../../validation/new-restaurant.validation';

import FormProvider from '../../components/hook-form/FormProvider';
import useRestaurantQuery from '../../hooks/queries/useRestaurantQuery';
import { postCompanyInfo } from '../../utils/api';

import { PATH_NEW_RESTAURANT } from '../../routes/paths';
import MotionDivViewport from '../../components/animate/MotionDivViewport';
import useCreateRestaurantGuard from '../../hooks/useCreateRestaurantGuard';
import useRHFErrorMixpanelTracker from '../../hooks/useRHFErrorMixpanelTracker';
import { MIXPANEL_EVENTS, mixpanelTrack } from '../../utils/mixpanel';
import { useAuthContext } from '../../hooks/useAuthContext';
import AddressAutocomplete from '../../components/address-autocomplete/AddressAutocomplete';
import RHFCountriesAutocomplete from '../../components/hook-form/RHFCountriesAutocomplete';

const NewRestaurantCompanyInfo = (props) => {
  const { data, isLoading, updateQuery } = useRestaurantQuery();
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();

  useCreateRestaurantGuard(data?.data, PATH_NEW_RESTAURANT.step_1);

  const defaultValues = useMemo(
    () => ({
      // company info
      company_name: data?.data?.company_info?.company_name || '',
      company_number: data?.data?.company_info?.company_number || '',
      company_address: {
        address_line_1:
          data?.data?.company_info?.company_address?.address_line_1 || '',
        address_line_2:
          data?.data?.company_info?.company_address?.address_line_2 || '',
        postcode: data?.data?.company_info?.company_address?.postcode || '',
        city: data?.data?.company_info?.company_address?.city || '',
        country:
          countries.find(
            (el) =>
              el.label === data?.data?.company_info?.company_address?.country
          ) || countries.find((el) => el.label === 'United Kingdom')
      }
    }),
    [
      data?.data?.company_info?.company_name,
      data?.data?.company_info?.company_number,
      data?.data?.company_info?.company_address?.address_line_1,
      data?.data?.company_info?.company_address?.address_line_2,
      data?.data?.company_info?.company_address?.postcode,
      data?.data?.company_info?.company_address?.city,
      data?.data?.company_info?.company_address?.country
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
    formState: { errors, isSubmitting, isSubmitSuccessful },
    getValues,
    getFieldState,
    setValue,
    watch
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
      console.log(key, value);
      setValue(`company_address.${key}`, value);
    });
  };

  const onSubmit = async (data) => {
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
      // reset();
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
      errArr.forEach(([name, value]) =>
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
    [user?.email]
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
              variant={'filled'}
              name="company_name"
              label="Registered company name"
              placeholder={'e.g My Restaurant Ltd'}
            />
            <RHFTextField
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
                    variant={'filled'}
                    name="company_address.address_line_1"
                    label="Address line 1"
                    placeholder={'e.g 23 Red Baloon Street'}
                  />
                </Box>
                <Box mb={2}>
                  <RHFTextField
                    variant={'filled'}
                    name="company_address.address_line_2"
                    label="Address line 2 (Optional)"
                    placeholder={'e.g Didsbury'}
                  />
                </Box>
                <Box mb={2}>
                  <RHFTextField
                    variant={'filled'}
                    name="company_address.postcode"
                    label="Post / Zip code"
                    placeholder={'e.g M20 2FG'}
                  />
                </Box>
                <Box mb={2}>
                  <RHFTextField
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
                authenticity as a restaurant, thus ensuring a level of safety is
                met for our customers.
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

NewRestaurantCompanyInfo.propTypes = {};

export default NewRestaurantCompanyInfo;
