import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';

import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';

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
import { newDealSchema } from '../../../validation/deals.validation';
import {
  InputWithInfoInfoContainer,
  InputWithInfoInputContainer,
  InputWithInfoStack
} from '../../../features/forms/styles';
import { RHFAutocomplete, RHFTextField } from '../../../components/hook-form';
import useCustomMediaQueries from '../../../hooks/useCustomMediaQueries';
import Subheader from '../../../components/subheader/Subheader';
import { MAX_DEALS } from '../../../constants/deals.constants';
import { DashboardTitleContainer } from '../styles';
import DateRangePicker from '../../../components/date-range-picker/DateRangePicker';
import RHFMultipleAutocomplete from '../../../components/hook-form/RHFMultipleAutoComplete';
import useLocationsQuery from '../../../hooks/queries/useLocationsQuery';
import Spacer from '../../../components/spacer/Spacer';

// components

function getElementsByText(str, tag = 'div') {
  return Array.prototype.slice
    .call(document.getElementsByTagName(tag))
    .filter((el) => el.textContent.trim() === str.trim());
}

function removeLicenseEl() {
  getElementsByText('MUI X Missing license key').forEach((el) => el.remove());
}

const datePickerSx = {
  backgroundColor: 'transparent',
  padding: 0,

  '.MuiDialogActions-root': {
    display: 'none'
  },
  '.MuiPickersToolbar-root': {
    padding: 0,
    'span.MuiTypography-overline': {
      display: 'none'
    }
  },
  '.MuiDateRangeCalendar-monthContainer': {
    border: '1px solid #f0f0f0',
    borderRadius: '8px',
    marginTop: '16px'
  }
};

// ----------------------------------------------------------------------

export default function DealsCreate() {
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
    resolver: yupResolver(newDealSchema),
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

  useEffect(() => {
    removeLicenseEl();
  }, []);

  const { data } = useLocationsQuery();

  const locationOptions = useMemo(() => {
    const locs = data?.data;
    if (!locs?.length) return [];
    return locs.map((l) => {
      return {
        name: `${l.nickname}, ${l.address.address_line_1}, ${l.address.postcode}`,
        _id: l._id
      };
    });
  }, [data?.data?.length]);

  const [date, setDate] = useState('');
  return (
    <>
      <Helmet>
        <title> Create a new deal | Foodie</title>
      </Helmet>

      <Container maxWidth={'xl'}>
        <DashboardTitleContainer>
          <DashboardTitle title="Create a new deal" />
          <Typography variant="body2" color={'text.secondary'}>
            Use this form to create a new deal, you're allowed to have a{' '}
            <strong>maximum of {MAX_DEALS} active deals </strong> at one time.
            You can manage your deals here.
          </Typography>
        </DashboardTitleContainer>
        <Box>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Box>
              <Subheader text={'Give your deal a name & description'} />
              <InputWithInfoStack>
                <InputWithInfoInputContainer>
                  <RHFTextField
                    sx={{ flex: 1, marginBottom: 3 }}
                    name="name"
                    label="Give your deal a name"
                    placeholder="e.g 2 for 1 Lunch Menu (Mon - Fri)"
                    variant={'filled'}
                  />
                  <RHFTextField
                    multiline
                    variant={'filled'}
                    rows={4}
                    placeholder="e.g Enjoy a taste of our menu at a 2 fo 1 discount during weekday lunch hours. Perfect for business meeting and lunchbreaks... "
                    name="description"
                    label="Enter your deal description (max 140 characters)"
                  />
                  <Spacer />
                  <Subheader
                    text={'Select 1 or more locations for this deal'}
                  />
                  <RHFMultipleAutocomplete
                    isOptionEqualToValue={(option, value) => {
                      return option.name === value.name;
                    }}
                    options={locationOptions}
                    name={'locations'}
                    label="Select 1 or more locations"
                    placeholder="Start typing or choose from the dropdown"
                  />
                  <Spacer />
                  <Subheader
                    sx={{ marginBottom: 8 }}
                    text={'How long do you want to advertise this deal for?'}
                  />
                  <Typography mb={1} variant="body2" color={'text.secondary'}>
                    Must choose a location first, each individual deal can only
                    exist in one timezone.
                  </Typography>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <StaticDateRangePicker
                      disablePast
                      sx={datePickerSx}
                      onChange={(v) => console.log(v)}
                    />
                  </LocalizationProvider>
                </InputWithInfoInputContainer>
                <InputWithInfoInfoContainer>
                  <Alert icon={<HelpIcon />} severity={'success'}>
                    <AlertTitle>How do deals work?</AlertTitle>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. At
                    neque minima sit doloribus harum soluta necessitatibus hic?
                    Dolorum, pariatur eligendi{' '}
                    <strong>Siganti et il gido!</strong>
                    <br />
                    <br />
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Unde temporibus hic vel minima incidunt rem similique
                    placeat voluptatibus omnis ipsam quia eligendi dolor
                    consequatur dolorem, ipsa magni!
                    <br />
                    <br />
                    Sapiente neque, suscipit deserunt porro explicabo iusto
                    doloribus? Molestiae voluptatum facilis tenetur aperiam
                    doloribus officiis architecto. Dolor minus sit, obcaecati
                    reiciendis culpa inventore.
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
