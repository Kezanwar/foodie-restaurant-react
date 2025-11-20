import { useCallback, useEffect, useMemo, useState } from 'react';

import { Helmet } from 'react-helmet-async';
import { useForm, useFormContext } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router';
import {
  LocalizationProvider,
  StaticDatePicker
} from '@mui/x-date-pickers-pro';
import { add, addDays, format, startOfDay } from 'date-fns';

import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Container,
  Typography,
  Alert,
  AlertTitle,
  Button,
  FormHelperText
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
import LoadingScreen from 'components/loading-screen/LoadingScreen';
import AcceptDeclineModal from 'components/modals/accept-decline-modal/AcceptDeclineModal';

import { PATH_DASHBOARD } from 'routes/paths';
import useSingleDealQuery from 'hooks/queries/useSingleDealQuery';
import useActiveDealsQuery from 'hooks/queries/useActiveDealsQuery';
import useCustomMediaQueries from 'hooks/useCustomMediaQueries';
import useLocationsQuery from 'hooks/queries/useLocationsQuery';
import { editDeal } from 'lib/api';
import { MIXPANEL_EVENTS, mixpanelTrack } from 'lib/mixpanel';
import { editDealSchema } from 'validation/deals';
import Breadcrumbs from 'components/breadcrumbs';

import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';
import { useUtilityContext } from 'hooks/useUtilityContext';
import ExpandableBox from 'components/expandable-box/ExpandableBox';
import { DateButtonsWrapper } from './styles';
import { SelectButton } from 'components/select-button/SelectButton';

function getElementsByText(str, tag = 'div') {
  return Array.prototype.slice
    .call(document.getElementsByTagName(tag))
    .filter((el) => el.textContent.trim() === str.trim());
}

function removeLicenseEl() {
  getElementsByText('MUI X Missing license key').forEach((el) => el.remove());
}

const MIN_DATE = add(new Date(), { days: 1 });

// ----------------------------------------------------------------------

export default function DealsEdit() {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [datePickerValue, setDatePickerValue] = useState('');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const onCancel = () => navigate(-1);

  const { id } = useParams();
  const { data: dealData, error, isLoading, refetch } = useSingleDealQuery(id);

  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
      end_date: '',
      locations: []
    }),
    []
  );

  const { locale } = useUtilityContext();

  const {
    data,
    isLoading: locationsLoading,
    error: locationsError
  } = useLocationsQuery();

  const methods = useForm({
    resolver: yupResolver(editDealSchema),
    defaultValues
  });

  const {
    reset,
    setError,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    getValues,
    watch,
    setValue
  } = methods;

  const locationOptions = useMemo(() => {
    const locs = data?.locations;
    if (!locs?.length) return [];
    return locs
      .filter((x) => !x.archived)
      .map((l) => {
        return {
          name: `${l.nickname}, ${l.address.address_line_1}, ${l.address.postcode}`,
          _id: l._id
        };
      });
  }, [data?.locations]);

  useEffect(() => {
    if (dealData?.data) {
      const { name, description, end_date, locations } = dealData?.data;

      setValue('name', name);
      setValue('description', description);
      setValue(
        'locations',
        locationOptions.filter((loc) =>
          locations.some((dealLoc) => loc._id === dealLoc.location_id)
        )
      );
      setValue('end_date', end_date || '');
      setDatePickerValue(end_date ? new Date(end_date) : '');
      if (end_date) {
        setShowDatePicker(true);
      }
    }
  }, [dealData?.data, data?.data]);

  const dateErrors = errors.start_date || errors.end_date;

  const allActiveDeals = useActiveDealsQuery();

  const updateStaticDatePicker = (v) => {
    const s = startOfDay(v);
    setValue('end_date', s.toISOString());
    setDatePickerValue(s);
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
    const formData = getValues();
    try {
      setFormSubmitLoading(true);
      const postLocations = formData?.locations?.map((l) => l._id);
      await editDeal(id, {
        ...formData,
        locations: postLocations
      });
      await allActiveDeals.refetch();
      refetch();
      mixpanelTrack(MIXPANEL_EVENTS.edit_deal_success, {
        formData
      });
      enqueueSnackbar(`${formData.name} edited successfully`, {
        variant: 'success'
      });
      reset();
      setFormSubmitLoading(false);
      setShowConfirmModal(false);
      navigate(`${PATH_DASHBOARD.deals_single}/${id}`);
    } catch (error) {
      setError('afterSubmit', {
        ...error,
        message: error.message
      });
      mixpanelTrack(MIXPANEL_EVENTS.edit_deal_error, {
        formData
      });
      setFormSubmitLoading(false);
      setShowConfirmModal(false);
    }
  }, []);

  const onSubmit = async (data) => {
    setShowConfirmModal(true);
  };

  useEffect(() => {
    removeLicenseEl();
  }, []);

  useEffect(() => {
    if (error || locationsError || dealData?.data?.is_expired) {
      navigate('/dashboard/deals/live', { replace: true });
    }
  }, [error, locationsError, dealData?.data?.is_expired]);

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

  const breadcrumbs = useMemo(
    () => [
      { name: 'Deals', link: '/dashboard/deals' },
      { name: dealData?.data.name, link: '/dashboard/deals' }
    ],
    [dealData?.data.name]
  );

  const dateErrorText = errors?.end_date?.message;

  const onNoEndDate = () => {
    setShowDatePicker(false);
    setValue('end_date', '');
  };

  const onCustomDateRange = () => {
    const v = data.data.end_date;
    if (v) {
      setValue('end_date', v);
      setDatePickerValue(new Date(v));
      setShowDatePicker(true);
    } else {
      const d = startOfDay(addDays(new Date(), 1));
      setValue('end_date', d.toISOString());
      setDatePickerValue(d);
      setShowDatePicker(true);
    }
  };

  return isLoading || locationsLoading ? (
    <LoadingScreen />
  ) : (
    <>
      <Helmet>
        <title> Edit deal | Foodie</title>
      </Helmet>

      <Container sx={{ px: 3 }} maxWidth={'xl'}>
        <DashboardTitleContainer>
          <Breadcrumbs mb={2} current={'Edit'} trail={breadcrumbs} />
          <DashboardTitle title={`Edit deal`} />
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
                  <Subheader sx={{ marginBottom: 8 }} text={'Deal name'} />
                  <Typography mb={2} variant="body2" color={'text.secondary'}>
                    Once created, you can't edit a deals name as this will
                    comprimise the integrity of the data.
                  </Typography>
                  <RHFTextField
                    sx={{ mb: 6 }}
                    name="name"
                    disabled
                    label="Give your deal a name"
                    placeholder="e.g 2 for 1 Lunch Menu (Mon - Fri)"
                    variant={'filled'}
                  />
                  <Subheader
                    sx={{ marginBottom: 8 }}
                    text={'Edit your deals description'}
                  />
                  <Typography mb={2} variant="body2" color={'text.secondary'}>
                    * Please include all relevant information including any
                    restricted times the offer is available here, e.g Lunch time
                    special, available between 12-4pm etc.
                  </Typography>
                  <RHFTextField
                    multiline
                    variant={'filled'}
                    rows={4}
                    placeholder="e.g Enjoy a taste of our menu at a 2 fo 1 discount during weekday lunch hours. Perfect for business meeting and lunchbreaks... "
                    name="description"
                    label="Enter your deal description (max 140 characters)"
                  />
                  <Spacer sp={6} />
                  <Subheader text={'Edit selected locations for this deal'} />
                  <RHFMultipleAutocomplete
                    noOptionsText={'No Active Locations'}
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
                    text={'Edit deal end date'}
                  />
                  <Typography mb={2} variant="body2" color={'text.secondary'}>
                    * You can expire a deal at any time from your dashboard.
                  </Typography>
                  <DateButtonsWrapper>
                    <SelectButton
                      isSelected={!showDatePicker}
                      variant="outlined"
                      color={!showDatePicker ? 'primary' : 'inherit'}
                      onClick={onNoEndDate}
                    >
                      No End Date
                    </SelectButton>
                    <SelectButton
                      isSelected={showDatePicker}
                      variant="outlined"
                      color={showDatePicker ? 'primary' : 'inherit'}
                      onClick={onCustomDateRange}
                    >
                      End Date
                    </SelectButton>
                  </DateButtonsWrapper>
                  <ExpandableBox expanded={showDatePicker}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: isTablet ? 'center' : 'flex-start'
                      }}
                    >
                      <LocalizationProvider
                        adapterLocale={locale}
                        dateAdapter={AdapterDateFns}
                      >
                        <StaticDatePicker
                          disablePast
                          minDate={MIN_DATE}
                          reduceAnimations={isTablet}
                          sx={datePickerSx}
                          value={datePickerValue}
                          onChange={(v) => updateStaticDatePicker(v)}
                        />
                      </LocalizationProvider>
                    </Box>
                  </ExpandableBox>

                  {dateErrors && (
                    <Box mt={2}>
                      <FormHelperText error>{dateErrorText}</FormHelperText>
                    </Box>
                  )}
                  {!!errors.afterSubmit && (
                    <Alert severity="error">{errors.afterSubmit.message}</Alert>
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
                      Save
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
              <EditDealModal
                onCancel={onCancelModal}
                onAccept={postDeal}
                submitLoading={formSubmitLoading}
                isOpen={showConfirmModal}
                startDate={
                  dealData?.data.start_date
                    ? format(
                        new Date(dealData?.data.start_date),
                        'EEE do MMM yyyy'
                      )
                    : ''
                }
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

const EditDealModal = ({
  onCancel,
  onAccept,
  submitLoading,
  isOpen,
  startDate
}) => {
  const { getValues } = useFormContext();
  const values = getValues();
  return (
    <AcceptDeclineModal
      onCancel={onCancel}
      onAccept={onAccept}
      acceptText={'Save deal'}
      cancelText={'Cancel'}
      submitLoading={submitLoading}
      title={'Confirm deal'}
      subtitle={'Please confirm your updated deals details'}
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
            <Typography fontSize={14}>{startDate}</Typography>
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
