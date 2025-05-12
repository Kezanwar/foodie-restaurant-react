/* eslint-disable react/prop-types */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm, useFormContext } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useLocation, useNavigate } from 'react-router';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { add, format, startOfDay } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';
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

import HelpIcon from '@mui/icons-material/Help';
import FormProvider from 'components/hook-form/FormProvider';

import {
  InputWithInfoInfoContainer,
  InputWithInfoInputContainer,
  InputWithInfoStack
} from 'components/hook-form/styles';
import DashboardTitle from 'components/dashboard-title/DashboardTitle';
import { RHFTextField } from 'components/hook-form';
import Subheader from 'components/subheader/Subheader';
import { DashboardTitleContainer } from '../styles';
import RHFMultipleAutocomplete from 'components/hook-form/RHFMultipleAutoComplete';
import Spacer from 'components/spacer/Spacer';
import { SelectButton } from 'components/select-button/SelectButton';
import ExpandableBox from 'components/expandable-box/ExpandableBox';
import AcceptDeclineModal from 'components/modals/accept-decline-modal/AcceptDeclineModal';

import { PATH_DASHBOARD } from 'routes/paths';
import useActiveDealsQuery from 'hooks/queries/useActiveDealsQuery';
import useCustomMediaQueries from 'hooks/useCustomMediaQueries';
import useLocationsQuery from 'hooks/queries/useLocationsQuery';
import { addDeal, getDealTemplate } from 'lib/api';
import { MIXPANEL_EVENTS, mixpanelTrack } from 'lib/mixpanel';

import { newDealSchema } from 'validation/deals';
import LoadingScreen from 'components/loading-screen/LoadingScreen';

import useDashboardOverviewQuery from 'hooks/queries/useDashboardOverviewQuery';
import Breadcrumbs from 'components/breadcrumbs';
import useTierLimits from 'hooks/useTierLimits';

import useRestaurantQuery from 'hooks/queries/useRestaurantQuery';
import { useUtilityContext } from 'hooks/useUtilityContext';
import { DateButtonsWrapper } from './styles';

const breadcrumbs = [{ name: 'Deals', link: '/dashboard/deals' }];

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

const today = startOfDay(new Date());

const todayISO = today.toISOString();

const DateInputOptions = [
  {
    text: 'No End Date',
    start_date: todayISO,
    end_date: ''
  },
  {
    text: '6 Months',
    start_date: todayISO,
    end_date: add(today, { months: 6 }).toISOString()
  },
  {
    text: '3 Months',
    start_date: todayISO,
    end_date: add(today, { months: 3 }).toISOString()
  },
  {
    text: '1 Month',
    start_date: todayISO,
    end_date: add(today, { months: 1 }).toISOString()
  },
  {
    text: '2 Weeks',
    start_date: todayISO,
    end_date: add(today, { weeks: 2 }).toISOString()
  }
];

// ----------------------------------------------------------------------

export default function DealsCreate() {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { search } = useLocation();

  const rest = useRestaurantQuery();

  const dashQuery = useDashboardOverviewQuery();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
      start_date: todayISO,
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

  const { locale } = useUtilityContext();

  const {
    reset,
    setError,
    watch,
    handleSubmit,
    trigger,
    clearErrors,
    formState: { errors },
    getValues,
    setValue
  } = methods;

  useEffect(() => {
    if (search) {
      const id = new URLSearchParams(search)?.get('template_id');
      if (id) {
        mixpanelTrack(MIXPANEL_EVENTS.use_template_deal);
        getDealTemplate(id)
          .then((res) => {
            const name = res?.data?.name || '';
            const description = res?.data?.description || '';
            setValue('name', name);
            setValue('description', description);
          })
          .catch(() => {
            enqueueSnackbar('Template not found', {
              variant: 'warning'
            });
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dateErrors = errors.start_date || errors.end_date;

  const allActiveDeals = useActiveDealsQuery();

  const dateErrorText = showDatePicker
    ? 'Required - please choose a start and end date'
    : 'Must choose a date range to advertise this deal';

  const onCancel = () => navigate(-1);

  const updateFormDateRange = (start_date, end_date) => {
    setShowDatePicker(false);
    setValue('start_date', start_date);
    setValue('end_date', end_date);
    if (dateErrors) trigger();
  };

  const updateStaticDatePicker = ([start, end]) => {
    const s = startOfDay(start);
    const e = startOfDay(end);
    staticPickerValues.current = { start: s, end: e };

    if (start) {
      setValue('start_date', s.toISOString());
    } else {
      setValue('start_date', '');
    }
    if (end) {
      setValue('end_date', e.toISOString());
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
      setValue('start_date', start.toISOString());
    } else {
      setValue('start_date', '');
    }
    if (end) {
      setValue('end_date', end.toISOString());
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
      await addDeal({ ...data, locations: postLocations });
      await allActiveDeals.refetch();
      dashQuery.remove();
      mixpanelTrack(MIXPANEL_EVENTS.add_deal_success, {
        data
      });

      enqueueSnackbar(`${data.name} created successfully`, {
        variant: 'success'
      });
      reset();
      setFormSubmitLoading(false);
      setShowConfirmModal(false);
      navigate(PATH_DASHBOARD.deals);
    } catch (error) {
      setError('afterSubmit', {
        ...error,
        message: error.message
      });
      setFormSubmitLoading(false);
      setShowConfirmModal(false);
      mixpanelTrack(MIXPANEL_EVENTS.add_deal_error, {
        data
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async () => {
    setShowConfirmModal(true);
  };

  const { data, isLoading } = useLocationsQuery();

  const locationOptions = useMemo(() => {
    const locs = data?.data;
    if (!locs?.length) return [];
    return locs
      .filter((x) => !x.archived)
      .map((l) => {
        return {
          name: `${l.nickname}, ${l.address.address_line_1}, ${l.address.postcode}`,
          _id: l._id
        };
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const limits = useTierLimits();

  const canAddDeal =
    limits.deals.current < limits.deals.limit && rest.data?.data?.is_subscribed;

  const loading =
    allActiveDeals?.isLoading ||
    isLoading ||
    limits.isLoading ||
    rest.isLoading;

  useEffect(() => {
    if (!loading && canAddDeal) {
      removeLicenseEl();
    } else {
      navigate('/dashboard/deals', { replace: true });
      enqueueSnackbar(
        "   You've hit the limit of Active Deals you can create for your Subscription Tier.",
        { variant: 'warning' }
      );
    }
  }, [showDatePicker, canAddDeal]);

  if (loading) return <LoadingScreen />;

  return (
    <>
      <Helmet>
        <title> Create a new deal | Foodie</title>
      </Helmet>

      <Container sx={{ px: 3 }} maxWidth={'xl'}>
        <Breadcrumbs mb={2} current={'Create New'} trail={breadcrumbs} />
        <DashboardTitleContainer>
          <DashboardTitle title="Create a new deal" />
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
                    text={'How long would you like to run this campaign for?'}
                  />
                  <Typography mb={2} variant="body2" color={'text.secondary'}>
                    * You can expire a deal at any time from your dashboard
                  </Typography>

                  <DateButtonsWrapper>
                    {DateInputOptions.map((dateObj) => {
                      const isSelected =
                        !showDatePicker &&
                        endDate === dateObj.end_date &&
                        startDate === dateObj.start_date;
                      return (
                        <SelectButton
                          key={dateObj.text}
                          isSelected={isSelected}
                          variant="outlined"
                          color={
                            dateErrors
                              ? 'error'
                              : isSelected
                              ? 'primary'
                              : 'inherit'
                          }
                          onClick={() =>
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
                      Choose date range
                    </SelectButton>
                  </DateButtonsWrapper>

                  <LocalizationProvider
                    adapterLocale={locale}
                    dateAdapter={AdapterDateFns}
                  >
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
                    <Box mt={2}>
                      <Alert severity="error">
                        {errors.afterSubmit.message}
                      </Alert>
                    </Box>
                  )}
                  <Box mt={4} sx={{ display: 'flex' }}>
                    <Button color="inherit" onClick={onCancel} sx={{ mr: 1 }}>
                      Cancel
                    </Button>
                    <Box sx={{ flexGrow: 1 }} />

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
                    <AlertTitle>How do deals work?</AlertTitle>A Deal requires a
                    name, description and 1 or more locations assigned to it.
                    You also need to specify how long you would like the deal to
                    appear on the mobile app.
                    <br />
                    <br />
                    <strong>
                      Please include any time restrictions in the title or
                      description.
                    </strong>
                    <br />
                    <br />
                    Foodie's deal system streamlines the process for restaurants
                    to showcase their special offers. As soon as you post a
                    deal, it seamlessly integrates into our app and is filtered
                    by customer preferences such as cuisine, dietary
                    requirements, and location and can be time-restricted.
                    <br />
                    <br />
                    Our advanced search function takes into account keywords
                    found in both the deal's title and description, facilitating
                    a more efficient and personalized connection between diners
                    and enticing discounts.
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
          {values?.locations.map((l) => (
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
              {values?.end_date
                ? format(new Date(values?.end_date), 'EEE do MMM yyyy')
                : 'N/A'}
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
