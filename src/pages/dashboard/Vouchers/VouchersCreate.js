import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Container,
  Typography,
  Alert,
  AlertTitle,
  TextField
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import DashboardTitle from '../../../components/dashboard-title/DashboardTitle';
import FormProvider from '../../../components/hook-form/FormProvider';

import { companyInfoSchema } from '../../../validation/new-restaurant.validation';
import { newVoucherSchema } from '../../../validation/vouchers.validation';
import {
  InputWithInfoInfoContainer,
  InputWithInfoInputContainer,
  InputWithInfoStack
} from '../../../features/forms/styles';
import { RHFTextField } from '../../../components/hook-form';
import useCustomMediaQueries from '../../../hooks/useCustomMediaQueries';
import Subheader from '../../../components/subheader/Subheader';
import { MAX_VOUCHERS } from '../../../constants/vouchers.constants';
import { DashboardTitleContainer } from '../styles';
import DateRangePicker from '../../../components/date-range-picker/DateRangePicker';

// import DateRangePicker from '../../../components/date-range-picker/DateRangePicker';

// components

// ----------------------------------------------------------------------

export default function AddNewVoucher() {
  const { isTablet } = useCustomMediaQueries();
  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
      start_date: '',
      end_date: '',
      timezone: '',
      locations: []
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(newVoucherSchema),
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

  const onSubmit = async () => {};
  return (
    <>
      <Helmet>
        <title> Create a new voucher | Foodie</title>
      </Helmet>

      <Container maxWidth={'xl'}>
        <DashboardTitleContainer>
          <DashboardTitle title="Create a new voucher" />
          <Typography variant="body1">
            Use this form to create a new voucher, you're allowed to have a{' '}
            <strong>maximum of {MAX_VOUCHERS} active vouchers </strong> at one
            time. You can manage your vouchers here.
          </Typography>
        </DashboardTitleContainer>
        <Box>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Box>
              <Subheader text={'Add voucher name & description'} />
              <InputWithInfoStack>
                <InputWithInfoInputContainer>
                  <RHFTextField
                    sx={{ flex: 1, marginBottom: 3 }}
                    name="name"
                    label="Give your voucher a name"
                    placeholder="e.g 2 for 1 Lunch Menu (Mon - Fri)"
                    variant={'filled'}
                  />
                  <RHFTextField
                    multiline
                    variant={'filled'}
                    rows={4}
                    placeholder="e.g Enjoy a taste of our menu at a 2 fo 1 discount during weekday lunch hours. Perfect for business meeting and lunchbreaks... "
                    name="description"
                    label="Enter your voucher description (max 140 characters)"
                  />
                </InputWithInfoInputContainer>
                <InputWithInfoInfoContainer>
                  <Alert icon={<HelpIcon />} severity={'success'}>
                    <AlertTitle>How is this used?</AlertTitle>
                    Your Restaurant name is what shows up in the search for
                    vouchers and restaurants, if you are a chain, when you add
                    multiple locations the name will show up followed by the
                    locations provided nickname in brackets. e.g -{' '}
                    <strong>Rudy's (Ancoats Sq)</strong>
                  </Alert>
                </InputWithInfoInfoContainer>
              </InputWithInfoStack>
              <Subheader text={'Voucher start - end dates'} />
              <InputWithInfoStack>
                <InputWithInfoInputContainer>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box
                      onClick={() => console.log('yo')}
                      sx={{
                        display: 'flex',
                        gap: 3
                      }}
                    >
                      <DatePicker
                        label="Start date"
                        renderInput={(params) => (
                          <TextField {...params} fullWidth />
                        )}
                      />
                      <DatePicker
                        label="End date"
                        renderInput={(params) => (
                          <TextField readOnly {...params} fullWidth />
                        )}
                      />
                      {/* <Typography>12/05/2023 - 22/05/2023</Typography> */}
                    </Box>

                    {/* <DateRangePicker open title="Select voucher date range" /> */}
                  </LocalizationProvider>
                </InputWithInfoInputContainer>
                <InputWithInfoInfoContainer>
                  <Alert icon={<HelpIcon />} severity={'success'}>
                    <AlertTitle>How is this used?</AlertTitle>
                    Your Restaurant name is what shows up in the search for
                    vouchers and restaurants, if you are a chain, when you add
                    multiple locations the name will show up followed by the
                    locations provided nickname in brackets. e.g -{' '}
                    <strong>Rudy's (Ancoats Sq)</strong>
                  </Alert>
                </InputWithInfoInfoContainer>
              </InputWithInfoStack>
            </Box>
          </FormProvider>
        </Box>
      </Container>
    </>
  );
}
