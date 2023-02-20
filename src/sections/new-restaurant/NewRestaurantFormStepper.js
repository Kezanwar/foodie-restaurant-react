import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Step, StepLabel, Stepper } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MotionContainer } from '../../components/animate';
import FormProvider from '../../components/hook-form/FormProvider';
import scrollToTop from '../../components/scroll-to-top';
import { pageScrollToTop } from '../../utils/scroll';
import NewRestaurantAddLocations from './forms/NewRestaurantAddLocations';
import NewRestaurantCompanyInfo from './forms/NewRestaurantCompanyInfo';
import NewRestaurantCreateRestaurant from './forms/NewRestaurantCreateRestaurant';
import NewRestaurantYourApplication from './forms/NewRestaurantYourApplication';
import { NewRestaurantSchema } from './validation';

export const NewRestaurantFormStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);

  const defaultValues = useMemo(
    () => ({
      activeStep,
      // company info
      company_name: '',
      company_number: '',
      company_address: {
        address_line_1: '',
        address_line_2: '',
        postcode: '',
        city: '',
        country: 'United Kingdom'
      },
      // create restaurant
      name: '',
      avatar: null,
      is_new_avatar: true,
      cover_photo: null,
      is_new_cover: true,
      bio: '',
      social_media: {
        instagram: '',
        facebook: '',
        tiktok: '',
        linkedin: ''
      },
      // add location
      locations: [],
      is_new_location: false,
      add_location: {
        address_line_1: '',
        address_line_2: '',
        postcode: '',
        city: '',
        country: 'United Kingdom',
        email: '',
        phone_number: '',
        nickname: ''
      }
    }),
    [activeStep]
  );

  const methods = useForm({
    resolver: yupResolver(NewRestaurantSchema),
    defaultValues
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    getValues,
    setValue
  } = methods;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => {
      const newStep = prevActiveStep + 1;
      setValue('activeStep', newStep);
      return newStep;
    });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => {
      const newStep = prevActiveStep - 1;
      setValue('activeStep', newStep);
      return newStep;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
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

  const FORM_STEPS = [
    { label: 'Company Info', form: <NewRestaurantCompanyInfo /> },
    { label: 'Create Restaurant', form: <NewRestaurantCreateRestaurant /> },
    { label: 'Add Locations', form: <NewRestaurantAddLocations /> },
    { label: 'Your Application', form: <NewRestaurantYourApplication /> }
  ];

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {/* STEPPER */}
      <Box mb={6}>
        <Stepper activeStep={activeStep}>
          {FORM_STEPS.map((f, index) => (
            <Step key={f.label}>
              <StepLabel>{f.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <MotionContainer>{FORM_STEPS[activeStep].form}</MotionContainer>
      {/* FORMS */}
      <Button color="inherit" onClick={() => console.log(getValues())}>
        get values
      </Button>
      {/* ACTIONS */}
      <Box mt={4} sx={{ display: 'flex' }}>
        <Button
          color="inherit"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1, opacity: activeStep === 0 ? 0 : 1 }}
        >
          Back
        </Button>
        <Box sx={{ flexGrow: 1 }} />

        <LoadingButton
          loading={formSubmitLoading}
          type="submit"
          // color={'grey_palette'}
          variant="contained"
        >
          {activeStep === FORM_STEPS.length - 1 ? 'Finish' : 'Next'}
        </LoadingButton>
      </Box>
    </FormProvider>
  );
};
