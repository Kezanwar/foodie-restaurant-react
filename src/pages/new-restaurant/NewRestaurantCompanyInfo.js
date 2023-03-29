import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  InputWithInfoInfoContainer,
  InputWithInfoInputContainer,
  InputWithInfoStack
} from '../../sections/forms/styles';

import { companyInfoSchema } from '../../validation/new-restaurant.validation';

import FormProvider from '../../components/hook-form/FormProvider';
import useRestaurantQuery from '../../hooks/queries/useRestaurantQuery';
import { postCompanyInfo } from '../../utils/api';

import { PATH_NEW_RESTAURANT } from '../../routes/paths';
import MotionDivViewport from '../../components/animate/MotionDivViewport';

const NewRestaurantCompanyInfo = (props) => {
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);

  const { data, isLoading, updateQuery } = useRestaurantQuery();

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
          data?.data?.company_info?.company_address?.country || 'United Kingdom'
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
    setValue
  } = methods;

  const updateCountry = useCallback(
    (val) => {
      setValue('company_address.country', val);
    },
    [methods]
  );

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

  const handleBack = () => {};

  const onSubmit = async (data) => {
    try {
      // make dynamic api call
      setFormSubmitLoading(true);
      const updatedRestaurant = await postCompanyInfo(data);

      updateQuery(updatedRestaurant.data);
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

  return (
    <>
      <Helmet>
        <title> Step 1 | Foodie</title>
      </Helmet>
      <MotionDivViewport
        layout={'preserve-aspect'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, delay: 0.1 }}
      >
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          {/* STEPPER */}
          <Box
            sx={{
              maxWidth: '100vw',
              overflowX: 'auto'
            }}
            mb={6}
          >
            <Subheader
              sx={{ padding: 0, marginBottom: 16 }}
              text={'Company Information'}
            />
            <FormSectionStack>
              <RHFTextField
                variant={'filled'}
                name="company_name"
                label="Registered company name"
              />
              <RHFTextField
                variant={'filled'}
                name="company_number"
                label="Company number (Optional)"
              />
            </FormSectionStack>
            <Spacer />
            <Subheader
              sx={{ padding: 0, marginBottom: 16 }}
              text={'Company office address'}
            />
            <InputWithInfoStack>
              <InputWithInfoInputContainer>
                <Box mb={2}>
                  <RHFTextField
                    variant={'filled'}
                    name="company_address.address_line_1"
                    label="Address line 1"
                  />
                </Box>
                <Box mb={2}>
                  <RHFTextField
                    variant={'filled'}
                    name="company_address.address_line_2"
                    label="Address line 2 (Optional)"
                  />
                </Box>
                <Box mb={2}>
                  <RHFTextField
                    variant={'filled'}
                    name="company_address.postcode"
                    label="Post / Zip code"
                  />
                </Box>
                <Box mb={2}>
                  <RHFTextField
                    variant={'filled'}
                    name="company_address.city"
                    label="City"
                  />
                </Box>
                <Box mb={2}>
                  <Autocomplete
                    defaultValue={countries.find(
                      (c) => c.label === 'United Kingdom'
                    )}
                    fullWidth
                    autoHighlight
                    options={countries}
                    getOptionLabel={(option) => option.label}
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
                        <input
                          readOnly
                          value={option.label}
                          style={{ display: 'none' }}
                        />
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        label={'Country'}
                        variant={'filled'}
                        {...params}
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: 'disabled'
                        }}
                        onBlur={(e) => updateCountry(e.target.value)}
                        onChange={(e) => updateCountry(e.target.value)}
                      />
                    )}
                  />
                  {getFieldState('company_address.country')?.error?.message && (
                    <Typography fontSize={12} mt={1} pl={2} color={'error'}>
                      {getFieldState('company_address.country')?.error?.message}
                    </Typography>
                  )}
                </Box>
              </InputWithInfoInputContainer>
              <InputWithInfoInfoContainer>
                <Alert icon={<HelpIcon />} severity={'success'}>
                  <AlertTitle>Why do we need this?</AlertTitle>
                  We use the information taken on this step to confirm your
                  authenticity as a restaurant, thus ensuring a level of safety
                  is met for our customers.
                </Alert>
              </InputWithInfoInfoContainer>
            </InputWithInfoStack>

            {/* ACTIONS */}

            <Box mt={4} sx={{ display: 'flex' }}>
              <Button color="inherit" onClick={() => console.log(getValues())}>
                Back
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
      </MotionDivViewport>
    </>
  );
};

NewRestaurantCompanyInfo.propTypes = {};

export default React.memo(NewRestaurantCompanyInfo);
