import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm, useFormContext } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useLocation, useNavigate, useParams } from 'react-router';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { add, format } from 'date-fns';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Container,
  Typography,
  Alert,
  AlertTitle,
  Button,
  FormHelperText,
  styled
} from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import HelpIcon from '@mui/icons-material/Help';
import FormProvider from '../../../components/hook-form/FormProvider';

import {
  InputWithInfoInfoContainer,
  InputWithInfoInputContainer,
  InputWithInfoStack
} from '../../../features/forms/styles';
import DashboardTitle from '../../../components/dashboard-title/DashboardTitle';
import { RHFTextField } from '../../../components/hook-form';
import Subheader from '../../../components/subheader/Subheader';
import { DashboardTitleContainer } from '../styles';
import RHFMultipleAutocomplete from '../../../components/hook-form/RHFMultipleAutoComplete';
import Spacer from '../../../components/spacer/Spacer';
import { SelectButton } from '../../../components/select-button/SelectButton';
import ExpandableBox from '../../../components/expandable-box/ExpandableBox';
import AcceptDeclineModal from '../../../components/accept-decline-modal/AcceptDeclineModal';

import { PATH_DASHBOARD } from '../../../routes/paths';
import useActiveDealsQuery from '../../../hooks/queries/useActiveDealsQuery';
import { formattedDateString } from '../../../utils/formatTime';
import useCustomMediaQueries from '../../../hooks/useCustomMediaQueries';
import useLocationsQuery from '../../../hooks/queries/useLocationsQuery';
import { addDeal, getDealTemplate } from '../../../utils/api';
import { MIXPANEL_EVENTS, mixpanelTrack } from '../../../utils/mixpanel';

import { newDealSchema } from '../../../validation/deals.validation';
import LoadingScreen from '../../../components/loading-screen/LoadingScreen';
import { DEALS_PER_LOCATION } from '../../../constants/deals.constants';

function getElementsByText(str, tag = 'div') {
  return Array.prototype.slice
    .call(document.getElementsByTagName(tag))
    .filter((el) => el.textContent.trim() === str.trim());
}

function removeLicenseEl() {
  let deleted = false;
  const elements = getElementsByText('MUI X Missing license key');
  if (!deleted && !elements?.length) {
    setTimeout(() => removeLicenseEl(), 100);
  } else {
    elements.forEach((el) => {
      el.remove();
    });
    deleted = true;
  }
}

const DateInputOptions = [
  {
    text: '6 Months',
    start_date: formattedDateString(new Date()),
    end_date: formattedDateString(add(new Date(), { months: 6 }))
  },
  {
    text: '3 Months',
    start_date: formattedDateString(new Date()),
    end_date: formattedDateString(add(new Date(), { months: 3 }))
  },
  {
    text: '1 Month',
    start_date: formattedDateString(new Date()),
    end_date: formattedDateString(add(new Date(), { months: 1 }))
  },
  {
    text: '2 Weeks',
    start_date: formattedDateString(new Date()),
    end_date: formattedDateString(add(new Date(), { weeks: 2 }))
  }
];

export const DateButtonsWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  marginTop: 0,
  [theme.breakpoints.down('md')]: {
    justifyContent: 'center',
    marginTop: theme.spacing(3)
  }
}));

// ----------------------------------------------------------------------

export default function DealsCreate() {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const params = useParams();
  const { search } = useLocation();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
      start_date: '',
      end_date: '',
      locations: []
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(newDealSchema),
    defaultValues
  });

  const datePickerRef = useRef();
  const staticPickerValues = useRef({ start: '', end: '' });

  const {
    reset,
    setError,
    watch,
    handleSubmit,
    trigger,
    clearErrors,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    getValues,
    getFieldState,
    setValue
  } = methods;

  useEffect(() => {
    if (search) {
      const id = new URLSearchParams(search)?.get('template_id');
      if (id) {
        getDealTemplate(id)
          .then((res) => {
            const name = res?.data?.name;
            const description = res?.data?.description;
            setValue('name', name);
            setValue('description', description);
          })
          .catch((err) => {
            enqueueSnackbar('Template not found', {
              variant: 'warning'
            });
          });
      }
    }
  }, []);

  const dateErrors = errors.start_date || errors.end_date;

  const allActiveDeals = useActiveDealsQuery();

  const dateErrorText = showDatePicker
    ? 'Required - please choose a start and end date'
    : 'Must choose a date range to advertise this deal';

  const updateFormDateRange = (start_date, end_date) => {
    setShowDatePicker(false);
    setValue('start_date', start_date);
    setValue('end_date', end_date);
    if (dateErrors) trigger();
  };

  const updateStaticDatePicker = ([start, end]) => {
    staticPickerValues.current = { start, end };
    if (start) {
      setValue('start_date', formattedDateString(start?.$d));
    } else {
      setValue('start_date', '');
    }
    if (end) {
      setValue('end_date', formattedDateString(end?.$d));
    } else {
      setValue('end_date', '');
    }
    clearErrors();
  };

  const handleShowDatePicker = () => {
    const { start, end } = staticPickerValues.current;
    setShowDatePicker(true);
    clearErrors(['start_date', 'end_date']);

    if (start) {
      setValue('start_date', formattedDateString(start?.$d));
    } else {
      setValue('start_date', '');
    }
    if (end) {
      setValue('end_date', formattedDateString(end?.$d));
    } else {
      setValue('end_date', '');
    }
    setTimeout(
      () =>
        datePickerRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        }),
      300
    );
  };

  const onCancelModal = () => {
    setShowConfirmModal(false);
  };

  const postDeal = useCallback(async () => {
    await trigger();
    if (Object.values(errors).length) {
      onCancelModal();
      return;
    }
    const data = getValues();
    try {
      setFormSubmitLoading(true);
      const postLocations = data?.locations?.map((l) => l._id);
      const newDeal = await addDeal({ ...data, locations: postLocations });
      await allActiveDeals.refetch();
      mixpanelTrack(MIXPANEL_EVENTS.add_deal_success, {
        data
      });

      enqueueSnackbar(`${data.name} created successfully`, {
        variant: 'success'
      });
      reset();
      setFormSubmitLoading(false);
      setShowConfirmModal(false);
      navigate(PATH_DASHBOARD.deals_all);
    } catch (error) {
      setError('afterSubmit', {
        ...error,
        message: error.message
      });
      setFormSubmitLoading(false);
      setShowConfirmModal(false);
    }
  }, []);

  const onSubmit = async (data) => {
    setShowConfirmModal(true);
  };

  const { data, isLoading } = useLocationsQuery();

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

  const endDate = watch('end_date');
  const startDate = watch('start_date');

  const { isTablet } = useCustomMediaQueries();

  const datePickerSx = useMemo(
    () => ({
      backgroundColor: 'transparent',
      padding: 0,
      marginTop: 3,

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
      },
      '.MuiPickersToolbar-content': {
        justifyContent: isTablet ? 'center' : 'flex-start'
      }
    }),
    [isTablet]
  );

  const cantCreate = useMemo(() => {
    if (isLoading || allActiveDeals?.isLoading) return false;
    const locationsLength = data?.data?.length;
    const activeDealsLength = allActiveDeals?.data?.data.length;
    if (activeDealsLength >= locationsLength * DEALS_PER_LOCATION) return true;
    return false;
  }, [
    allActiveDeals?.data?.data?.length,
    data?.data?.length,
    isLoading,
    allActiveDeals?.isLoading
  ]);

  useEffect(() => {
    if (!cantCreate) {
      removeLicenseEl();
    }
  }, [showDatePicker, cantCreate]);

  if (allActiveDeals?.isLoading || isLoading) return <LoadingScreen />;

  if (cantCreate) return <CantCreate />;

  return (
    <>
      <Helmet>
        <title> Create a new deal | Foodie</title>
      </Helmet>

      <Container sx={{ px: 3 }} maxWidth={'xl'}>
        <DashboardTitleContainer>
          <DashboardTitle title="Create a new deal" />
          <Typography variant="body2" color={'text.secondary'}>
            {/* Use this form to create a new deal, you're allowed to have a{' '}
            <strong>maximum of {MAX_DEALS} active deals </strong> at one time.
            You can manage your deals here. */}
          </Typography>
        </DashboardTitleContainer>
        <Box>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Box pb={1}>
              <InputWithInfoStack reverseMob>
                <InputWithInfoInputContainer>
                  <Subheader
                    sx={{ marginBottom: 8 }}
                    text={'Give your deal a name & description'}
                  />
                  <Typography mb={2} variant="body2" color={'text.secondary'}>
                    * Please include all relevant information including any
                    restricted times the offer is available here, e.g Lunch time
                    special, available between 12-4pm...
                  </Typography>
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
                  <Spacer sp={6} />
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
                  <Spacer sp={6} />
                  <Subheader
                    sx={{ marginBottom: 8 }}
                    text={'How long do you want to advertise this deal for?'}
                  />
                  <Typography mb={2} variant="body2" color={'text.secondary'}>
                    * You can expire a deal at any time from your dashboard
                  </Typography>

                  <DateButtonsWrapper>
                    {DateInputOptions.map((dateObj) => {
                      const isCustomBtn = dateObj.text === 'Custom Date Range';
                      const isSelected =
                        !showDatePicker &&
                        endDate === dateObj.end_date &&
                        startDate === dateObj.start_date;
                      return (
                        <SelectButton
                          key={dateObj.text}
                          isSelected={isCustomBtn ? showDatePicker : isSelected}
                          variant="outlined"
                          color={
                            dateErrors
                              ? 'error'
                              : isSelected
                              ? 'primary'
                              : 'inherit'
                          }
                          onClick={
                            isCustomBtn
                              ? handleShowDatePicker
                              : () =>
                                  updateFormDateRange(
                                    dateObj.start_date,
                                    dateObj.end_date
                                  )
                          }
                        >
                          {dateObj.text}
                        </SelectButton>
                      );
                    })}
                    <SelectButton
                      isSelected={showDatePicker}
                      variant="outlined"
                      color={
                        dateErrors
                          ? 'error'
                          : showDatePicker
                          ? 'primary'
                          : 'inherit'
                      }
                      onClick={handleShowDatePicker}
                    >
                      Custom date range
                    </SelectButton>
                  </DateButtonsWrapper>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <ExpandableBox expanded={showDatePicker}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: isTablet ? 'center' : 'flex-start'
                        }}
                        ref={datePickerRef}
                      >
                        <StaticDateRangePicker
                          disablePast
                          reduceAnimations={isTablet}
                          sx={datePickerSx}
                          onChange={(v) => updateStaticDatePicker(v)}
                        />
                      </Box>
                    </ExpandableBox>
                  </LocalizationProvider>
                  {dateErrors && (
                    <Box mt={2}>
                      <FormHelperText error>{dateErrorText}</FormHelperText>
                    </Box>
                  )}
                  {!!errors.afterSubmit && (
                    <Alert severity="error">{errors.afterSubmit.message}</Alert>
                  )}
                  <Box mt={4} sx={{ display: 'flex' }}>
                    <Button color="inherit" onClick={() => {}} sx={{ mr: 1 }}>
                      Cancel
                    </Button>
                    <Box sx={{ flexGrow: 1 }} />
                    {/* <Button
                      color="inherit"
                      onClick={() => {
                        console.log(getValues());
                      }}
                      sx={{ mr: 1 }}
                    >
                      Vals
                    </Button> */}
                    <LoadingButton
                      loading={formSubmitLoading}
                      type="submit"
                      variant="contained"
                    >
                      Done
                    </LoadingButton>
                  </Box>
                </InputWithInfoInputContainer>
                <InputWithInfoInfoContainer>
                  <Alert
                    sx={{ mb: 2 }}
                    icon={<HelpIcon />}
                    severity={'success'}
                  >
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
            {showConfirmModal && (
              <CreateDealModal
                onCancel={onCancelModal}
                onAccept={postDeal}
                submitLoading={formSubmitLoading}
                isOpen={showConfirmModal}
              />
            )}
          </FormProvider>
        </Box>
      </Container>
    </>
  );
}

const ModalTitle = ({ children }) => (
  <Typography variant="h6" fontSize={'16px!important'}>
    {children}
  </Typography>
);

const CreateDealModal = ({ onCancel, onAccept, submitLoading, isOpen }) => {
  const { getValues } = useFormContext();
  const values = getValues();
  return (
    <AcceptDeclineModal
      onCancel={onCancel}
      onAccept={onAccept}
      acceptText={'Create deal'}
      cancelText={'Cancel'}
      submitLoading={submitLoading}
      title={'Confirm new deal'}
      subtitle={'Are you sure you want to create this deal?'}
      isOpen={isOpen}
    >
      <Box>
        <Box mb={2}>
          <ModalTitle>{values?.name}</ModalTitle>
          <Typography fontSize={14}>{values?.description}</Typography>
        </Box>
        <ModalTitle>Locations</ModalTitle>
        <Box mb={2}>
          {values?.locations.map((l, i) => (
            <Box key={l._id} mb={1} fontSize={14}>
              {l.name}
            </Box>
          ))}
        </Box>
        <Box display={'flex'} gap={2}>
          <Box>
            <ModalTitle>Start</ModalTitle>
            <Typography fontSize={14}>
              {format(new Date(values?.start_date), 'EEE do MMM yyyy')}
            </Typography>
          </Box>
          <Box>
            <ModalTitle>End</ModalTitle>
            <Typography fontSize={14}>
              {format(new Date(values?.end_date), 'EEE do MMM yyyy')}
            </Typography>
          </Box>
        </Box>
      </Box>
    </AcceptDeclineModal>
  );
};

// ----------------------------------

const sx = {
  bgcolor: 'text.primary',
  color: (theme) =>
    theme.palette.mode === 'light' ? 'common.white' : 'grey.800',
  width: 'max-content'
};

export const CantCreateContentWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2)
}));

export const CantCreateAlert = styled(Alert)(({ theme }) => ({
  maxWidth: '80%',
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    maxWidth: 'unset'
  }
}));

const CantCreate = () => {
  const nav = useNavigate();
  return (
    <>
      <Helmet>
        <title> Create a new deal | Foodie</title>
      </Helmet>
      <Container sx={{ px: 3 }} maxWidth={'xl'}>
        <CantCreateContentWrapper>
          <CantCreateAlert severity="warning">
            <AlertTitle>Maximum active deals reached</AlertTitle>
            <Box>You've reached the maximum amount of active deals.</Box>
          </CantCreateAlert>
          <Typography
            textAlign={'center'}
            mb={4}
            variant="body2"
            color={'text.secondary'}
          >
            Sorry, A restaurant can have a maxmim of{' '}
            <strong>{DEALS_PER_LOCATION} active deals per location.</strong>
            <br />
            <br />
            You must wait for an active deal to expire, or expire an active deal
            manually to create a new one.
          </Typography>
          <Button
            variant="contained"
            onClick={() => nav(PATH_DASHBOARD.deals_all)}
            sx={sx}
          >
            Manage your deals
          </Button>
        </CantCreateContentWrapper>
      </Container>
    </>
  );
};
