import { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Helmet } from 'react-helmet-async';
import { useForm, useFormContext } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router';
import {
  LocalizationProvider,
  StaticDatePicker
} from '@mui/x-date-pickers-pro';
import { format } from 'date-fns';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
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
import AcceptDeclineModal from 'components/accept-decline-modal/AcceptDeclineModal';

import { PATH_DASHBOARD } from 'routes/paths';
import useSingleDealQuery from 'hooks/queries/useSingleDealQuery';
import useActiveDealsQuery from 'hooks/queries/useActiveDealsQuery';
import { formattedDateString } from 'utils/formatTime';
import useCustomMediaQueries from 'hooks/useCustomMediaQueries';
import useLocationsQuery from 'hooks/queries/useLocationsQuery';
import { editDeal } from 'utils/api';
import { MIXPANEL_EVENTS, mixpanelTrack } from 'utils/mixpanel';
import { editDealSchema } from 'validation/deals';
import Breadcrumbs from 'components/breadcrumbs';

function getElementsByText(str, tag = 'div') {
  return Array.prototype.slice
    .call(document.getElementsByTagName(tag))
    .filter((el) => el.textContent.trim() === str.trim());
}

function removeLicenseEl() {
  getElementsByText('MUI X Missing license key').forEach((el) => el.remove());
}

const MIN_DATE = dayjs(new Date()).add(1, 'day');

// ----------------------------------------------------------------------

export default function DealsEdit() {
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

    setValue
  } = methods;

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
      setValue('end_date', end_date);
      setDatePickerValue(dayjs(end_date));
    }
  }, [dealData?.data, data?.data]);

  const dateErrors = errors.start_date || errors.end_date;

  const allActiveDeals = useActiveDealsQuery();

  const updateStaticDatePicker = (v) => {
    setValue('end_date', formattedDateString(v?.$d));
    setDatePickerValue(v);
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
      const updatedDeal = await editDeal(id, {
        ...data,
        locations: postLocations
      });
      await allActiveDeals.refetch();
      refetch();
      mixpanelTrack(MIXPANEL_EVENTS.edit_deal_success, {
        data
      });
      enqueueSnackbar(`${data.name} edited successfully`, {
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
        data
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
    if (error || locationsError) {
      navigate(PATH_DASHBOARD.deals_all, { replace: true });
    }
  }, [error, locationsError]);

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
                  <Subheader
                    sx={{ marginBottom: 8 }}
                    text={'Edit your deals a name & description'}
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
                  <Subheader text={'Edit selected locations for this deal'} />
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
                    text={'Edit deal end date'}
                  />
                  <Typography mb={2} variant="body2" color={'text.secondary'}>
                    * You can expire a deal at any time from your dashboard
                  </Typography>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: isTablet ? 'center' : 'flex-start'
                      }}
                    >
                      <StaticDatePicker
                        disablePast
                        minDate={MIN_DATE}
                        reduceAnimations={isTablet}
                        sx={datePickerSx}
                        value={datePickerValue}
                        onChange={(v) => updateStaticDatePicker(v)}
                      />
                    </Box>
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
              {format(new Date(values?.end_date || ''), 'EEE do MMM yyyy')}
            </Typography>
          </Box>
        </Box>
      </Box>
    </AcceptDeclineModal>
  );
};
