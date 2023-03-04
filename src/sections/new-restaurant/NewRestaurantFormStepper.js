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
  const [activeStep, setActiveStep] = useState(2);
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
      locations: [
        // {
        //   address_line_1: '2 Eversley Road',
        //   address_line_2: 'Didsbury',
        //   postcode: 'M20 2FL',
        //   city: 'Manchester',
        //   country: 'United Kingdom',
        //   email: 'kezanwar@gmail.com',
        //   phone_number: '07917620392',
        //   nickname: 'Arndale',
        //   opening_times: {
        //     mon: { is_open: true, open: '10:00 AM', close: '11:00 PM' },
        //     tue: { is_open: true, open: '10:00 AM', close: '11:00 PM' },
        //     wed: { is_open: true, open: '10:00 AM', close: '11:00 PM' },
        //     thu: { is_open: true, open: '10:00 AM', close: '11:00 PM' },
        //     fri: { is_open: true, open: '10:00 AM', close: '11:00 PM' },
        //     sat: { is_open: true, open: '10:00 AM', close: '11:00 PM' },
        //     sun: { is_open: true, open: '10:00 AM', close: '11:00 PM' }
        //   }
        // },
        // {
        //   address_line_1: '2 Eversley Road',
        //   address_line_2: 'Didsbury',
        //   postcode: 'M20 2FL',
        //   city: 'Manchester',
        //   country: 'United Kingdom',
        //   email: 'kezanwar@gmail.com',
        //   phone_number: '07917620392',
        //   nickname: 'Burton Road',
        //   opening_times: {
        //     mon: { is_open: true, open: '10:00 AM', close: '11:00 PM' },
        //     tue: { is_open: true, open: '10:00 AM', close: '11:00 PM' },
        //     wed: { is_open: true, open: '10:00 AM', close: '11:00 PM' },
        //     thu: { is_open: false, open: '10:00 AM', close: '11:00 PM' },
        //     fri: { is_open: true, open: '10:00 AM', close: '11:00 PM' },
        //     sat: { is_open: true, open: '10:00 AM', close: '11:00 PM' },
        //     sun: { is_open: true, open: '10:00 AM', close: '11:00 PM' }
        //   }
        // },
        // {
        //   address_line_1: '2 Eggy Road',
        //   address_line_2: 'Didsbury',
        //   postcode: 'M20 2FL',
        //   city: 'Manchester',
        //   country: 'United Kingdom',
        //   email: 'sugopasta@kitchen.com',
        //   phone_number: '07923620392',
        //   nickname: 'Altrincham Markets',
        //   opening_times: {
        //     mon: { is_open: true, open: '10:00 AM', close: '11:00 PM' },
        //     tue: { is_open: false, open: '10:00 AM', close: '11:00 PM' },
        //     wed: { is_open: true, open: '10:00 AM', close: '11:00 PM' },
        //     thu: { is_open: false, open: '10:00 AM', close: '11:00 PM' },
        //     fri: { is_open: true, open: '10:00 AM', close: '11:00 PM' },
        //     sat: { is_open: true, open: '10:00 AM', close: '11:00 PM' },
        //     sun: { is_open: true, open: '10:00 AM', close: '11:00 PM' }
        //   }
        // },
        // {
        //   address_line_1: '2 Eversley Road',
        //   address_line_2: 'Didsbury',
        //   postcode: 'M20 2FL',
        //   city: 'Manchester',
        //   country: 'United Kingdom',
        //   email: 'kezanwar@gmail.com',
        //   phone_number: '07917620392',
        //   nickname: 'Sale (Stanley SQ)',
        //   opening_times: {
        //     mon: { is_open: true, open: '10:00 AM', close: '11:00 PM' },
        //     tue: { is_open: true, open: '10:00 AM', close: '11:00 PM' },
        //     wed: { is_open: true, open: '10:00 AM', close: '11:00 PM' },
        //     thu: { is_open: true, open: '10:00 AM', close: '11:00 PM' },
        //     fri: { is_open: true, open: '10:00 AM', close: '11:00 PM' },
        //     sat: { is_open: true, open: '10:00 AM', close: '11:00 PM' },
        //     sun: { is_open: true, open: '10:00 AM', close: '11:00 PM' }
        //   }
        // }
      ],
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
      <Box
        sx={{
          maxWidth: '100vw',
          overflowX: 'auto'
        }}
        mb={6}
      >
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
