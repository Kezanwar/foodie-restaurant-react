import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Helmet } from 'react-helmet-async';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Container,
  Stack,
  styled,
  Typography
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import HelpIcon from '@mui/icons-material/Help';
import { LoadingButton } from '@mui/lab';

import LoadingScreen from 'components/loading-screen/LoadingScreen';
import { DashboardTitleContainer } from '../styles';
import DashboardTitle from 'components/dashboard-title/DashboardTitle';
import { RHFSelect, RHFTextField } from 'components/hook-form';
import {
  FormSectionStack,
  InputStack,
  InputWithInfoInfoContainer,
  InputWithInfoInputContainer,
  InputWithInfoStack
} from 'components/hook-form/styles';
import Subheader from 'components/subheader/Subheader';
import Spacer from 'components/spacer/Spacer';
import {
  RHFUploadAvatar,
  RHFUploadWithCrop
} from 'components/hook-form/RHFUpload';
import CustomTooltip from 'components/custom-tooltip/CustomTooltip';
import FormProvider from 'components/hook-form/FormProvider';
import RHFMultipleAutocomplete from 'components/hook-form/RHFMultipleAutoComplete';

import useRestaurantQuery from 'hooks/queries/useRestaurantQuery';
import useOptionsQuery from 'hooks/queries/useOptionsQuery';

import { restaurantDetailsSchema } from 'validation/new-restaurant';
import { getFormDataFromObject } from 'utils/formData';
import { editRestaurant } from 'lib/api';
import { MIXPANEL_EVENTS, mixpanelTrack } from 'lib/mixpanel';
import { image_tooltip } from 'constants/tooltips';
import { PATH_DASHBOARD } from 'routes/paths';
import Breadcrumbs from 'components/breadcrumbs';
import { alcohol_license_options } from 'constants/options';
import useAuthStore from 'stores/auth';

const uploadAvatarSx = {
  '& > *': {
    '& > *': {
      margin: 'unset!important'
    }
  },
  '& .MuiFormHelperText-root': {
    textAlign: 'left'
  }
};

const optEqVal = (option, value) => {
  return option.slug === value.slug;
};

const breadcrumbs = [{ name: 'Restaurant', link: '/dashboard/restaurant' }];

const RestaurantEdit = () => {
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const { data, isLoading, updateQuery } = useRestaurantQuery();
  const navigate = useNavigate();

  const onCancel = () => navigate(-1);

  const restaurant = data?.data;

  const options = useOptionsQuery();
  const { enqueueSnackbar } = useSnackbar();
  const user = useAuthStore((state) => state.user);

  const cuisineOptions = options?.data?.data?.cuisines;
  const dietaryOptions = options?.data?.data?.dietary_requirements;

  const defaultValues = useMemo(
    () => ({
      // company info
      name: data?.data?.name || '',
      avatar: data?.data?.avatar || null,
      cuisines: data?.data?.cuisines || [],
      alcohol_license: data?.data?.alcohol_license ?? true,
      dietary_requirements: data?.data?.dietary_requirements || [],
      is_new_avatar: !data?.data?.avatar,
      cover_photo: data?.data?.cover_photo || null,
      is_new_cover: !data?.data?.avatar,
      bio: data?.data?.bio || '',
      booking_link: data?.data?.booking_link || '',
      social_media: {
        instagram: data?.data?.social_media?.instagram || '',
        facebook: data?.data?.social_media?.facebook || '',
        tiktok: data?.data?.social_media?.tiktok || '',
        linkedin: data?.data?.social_media?.linkedin || ''
      }
    }),
    [
      data?.data?.booking_link,
      data?.data?.name,
      data?.data?.avatar,
      data?.data?.cover_photo,
      data?.data?.cuisines,
      data?.data?.alcohol_license,
      data?.data?.dietary_requirements,
      data?.data?.bio,
      data?.data?.social_media?.instagram,
      data?.data?.social_media?.facebook,
      data?.data?.social_media?.tiktok,
      data?.data?.social_media?.linkedin
    ]
  );

  const methods = useForm({
    resolver: yupResolver(restaurantDetailsSchema),
    defaultValues
  });

  const { setError, handleSubmit, watch, getValues, setValue } = methods;

  const onSubmit = useCallback(async (data) => {
    try {
      const {
        name,
        bio,
        avatar,
        is_new_avatar,
        cover_photo,
        is_new_cover,
        social_media,
        cuisines,
        dietary_requirements,
        booking_link,
        alcohol_license
      } = data;
      setFormSubmitLoading(true);
      const formData = getFormDataFromObject({
        name,
        ...(is_new_avatar && { avatar }),
        ...(is_new_cover && { cover_photo }),
        cuisines,
        alcohol_license,
        dietary_requirements,
        bio,
        social_media,
        booking_link
      });
      const updatedRestaurant = await editRestaurant(formData);
      mixpanelTrack(MIXPANEL_EVENTS.create_restaurant_rest_profile_success, {});
      updateQuery(updatedRestaurant.data);
      enqueueSnackbar('Restaurant profile updated 🚀', { variant: 'success' });
      navigate(PATH_DASHBOARD.restaurant);
    } catch (error) {
      mixpanelTrack(MIXPANEL_EVENTS.create_restaurant_rest_profile_failed, {
        error: error?.mesage || JSON.stringify(error)
      });
      enqueueSnackbar('Error updating profile', { variant: 'error' });
      setError('afterSubmit', {
        ...error,
        message: error?.message || 'An unexpected error occured'
      });
    }
    setFormSubmitLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const avatar = watch('avatar');
  const cover_photo = watch('cover_photo');

  useEffect(() => {
    if (avatar?.preview) {
      if (!getValues('is_new_avatar')) setValue('is_new_avatar', true);
    }
  }, [avatar?.preview, getValues, setValue]);

  useEffect(() => {
    if (cover_photo?.preview) {
      if (!getValues('is_new_cover')) setValue('is_new_cover', true);
    }
  }, [cover_photo?.preview, getValues, setValue]);

  const onError = useCallback(
    (errors) => {
      const errArr = Object.entries(errors);
      errArr.forEach(([, value]) =>
        value?.message
          ? enqueueSnackbar(value.message, { variant: 'error' })
          : null
      );

      const data = { ...errors };
      if (user?.email) {
        data.auth = user;
      }
      mixpanelTrack(MIXPANEL_EVENTS.create_restaurant_rest_profile_errors, {
        errors: data
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user?.email]
  );

  if (isLoading) return <LoadingScreen />;
  return (
    <>
      <Helmet>
        <title> Edit Profile | Foodie</title>
        <link rel="stylesheet" type="text/css" href="/styles/devices.css" />
      </Helmet>

      <Container sx={{ px: 3, pb: 6 }} maxWidth={'xl'}>
        <Breadcrumbs mb={2} current={'Edit'} trail={breadcrumbs} />
        <DashboardTitleContainer>
          <DashboardTitle title={`${restaurant.name}`} />
          <Typography variant="body2" color={'text.secondary'}>
            Edit your restaurant profile
          </Typography>
        </DashboardTitleContainer>
        <Box>
          <Helmet>
            <title> Step 2 | Foodie</title>
          </Helmet>
          <FormProvider
            methods={methods}
            onSubmit={handleSubmit(onSubmit, onError)}
          >
            <Subheader text={'your restaurants name'} />

            <InputWithInfoStack>
              <InputWithInfoInputContainer>
                <RHFTextField
                  sx={{ flex: 1 }}
                  name="name"
                  label="Add your restaurant name"
                  placeholder={'e.g Sugo Pasta Kitchen'}
                  variant={'filled'}
                />
              </InputWithInfoInputContainer>
              <InputWithInfoInfoContainer>
                <Alert icon={<HelpIcon />} severity={'success'}>
                  <AlertTitle>How is this used?</AlertTitle>
                  Your Restaurant name is what shows up in the search for deals
                  and restaurants, if you are a chain, when you add multiple
                  locations the name will show up followed by the locations
                  provided nickname in brackets. e.g -{' '}
                  <strong>Rudy's (Ancoats Sq)</strong>
                </Alert>
              </InputWithInfoInfoContainer>
            </InputWithInfoStack>
            <Subheader text={'Add your cuisines (Choose multiple or one)'} />

            <InputWithInfoStack>
              <InputWithInfoInputContainer>
                {cuisineOptions && (
                  <RHFMultipleAutocomplete
                    isOptionEqualToValue={optEqVal}
                    options={cuisineOptions}
                    name={'cuisines'}
                    label="Select cuisines"
                    placeholder="Start typing or choose from the dropdown"
                  />
                )}
              </InputWithInfoInputContainer>
              <InputWithInfoInfoContainer>
                <Alert icon={<HelpIcon />} severity={'success'}>
                  <AlertTitle>How do we use this?</AlertTitle>
                  Our mobile app allows your customers to favourite cuisine
                  types and filter by cuisine within their searches.
                </Alert>
              </InputWithInfoInfoContainer>
            </InputWithInfoStack>

            <Subheader text={'Is your restaurant licensed to serve Alcohol?'} />
            <InputWithInfoStack>
              <InputWithInfoInputContainer>
                <RHFSelect
                  variant="outlined"
                  label={'Alcohol license'}
                  name={'alcohol_license'}
                  options={alcohol_license_options}
                />
              </InputWithInfoInputContainer>
              <InputWithInfoInfoContainer>
                <Alert icon={<HelpIcon />} severity={'success'}>
                  <AlertTitle>Why do we need this?</AlertTitle>
                  To ensure everything is above board when promoting Alcohol
                  deals on our platform.
                </Alert>
              </InputWithInfoInfoContainer>
            </InputWithInfoStack>

            <Subheader
              text={
                'Add dietary requirements you cater for (Choose multiple or one)'
              }
            />
            <InputWithInfoStack>
              <InputWithInfoInputContainer>
                {dietaryOptions && (
                  <RHFMultipleAutocomplete
                    isOptionEqualToValue={optEqVal}
                    options={dietaryOptions}
                    name={'dietary_requirements'}
                    label="Select dietary requirements"
                    placeholder="Start typing or choose from the dropdown"
                  />
                )}
              </InputWithInfoInputContainer>
              <InputWithInfoInfoContainer>
                <Alert icon={<HelpIcon />} severity={'success'}>
                  <AlertTitle>Why do we need this?</AlertTitle>
                  We want to provide a pleasant user experience for customers by
                  letting them filter searches by their particular dietary
                  requirements.
                </Alert>
              </InputWithInfoInfoContainer>
            </InputWithInfoStack>

            <CustomTooltip mb={1} tooltipText={image_tooltip.tooltip} />

            <Subheader text={'Upload your Restaurant Avatar'} />

            <InputWithInfoStack>
              <InputWithInfoInputContainer sx={uploadAvatarSx}>
                <RHFUploadAvatar margin={0} name="avatar" label="" />
              </InputWithInfoInputContainer>
              <InputWithInfoInfoContainer>
                <Alert icon={<HelpIcon />} severity={'success'}>
                  <AlertTitle>How is the avatar used?</AlertTitle>
                  Your Restaurant Avatar acts as a profile image for your
                  Restaurant, your cover photo is used as the back drop.
                  <Box mt={1}>
                    If an image isn't provided for a new deal, the deal image
                    will default to your Restaurant Cover Photo.
                  </Box>
                  <Box mt={1}>
                    Images can be updated <strong>at any time.</strong>
                  </Box>
                </Alert>
              </InputWithInfoInfoContainer>
            </InputWithInfoStack>
            <CustomTooltip tooltipText={image_tooltip.tooltip} mb={1} />

            <Subheader text={'Upload your restaurant cover photo'} />
            <InputWithInfoStack>
              <InputWithInfoInputContainer>
                <RHFUploadWithCrop name="cover_photo" label="" />
              </InputWithInfoInputContainer>
              <InputWithInfoInfoContainer>
                <Alert icon={<HelpIcon />} severity={'success'}>
                  <AlertTitle>How is the cover photo used?</AlertTitle>
                  Your restaurant cover photo acts as a backdrop for your
                  restaurant profile screen and a fallback for deals if one
                  isn't provided for them.
                  <Box mt={1}>
                    Images can be updated <strong>at any time.</strong>
                  </Box>
                </Alert>
              </InputWithInfoInfoContainer>
            </InputWithInfoStack>

            <Spacer />

            <Subheader
              text={'Add a bio for customers to read (Max 500 characters)'}
            />
            <FormSectionStack>
              <RHFTextField
                multiline
                variant={'filled'}
                rows={4}
                name="bio"
                placeholder={
                  'e.g A Southern Italian Pasta Kitchen. Inspired by the Italian South. Made in Manche....'
                }
                label="Enter your restaurant biography"
              />
            </FormSectionStack>
            <Spacer />
            <Subheader
              text={'Add a booking link for your restaurant (optional)'}
            />

            <InputWithInfoStack>
              <InputWithInfoInputContainer>
                <RHFTextField
                  sx={{ flex: 1 }}
                  name="booking_link"
                  label="Add your booking link"
                  placeholder={'e.g https://www.yourwebsite.com/booking'}
                  variant={'filled'}
                />
              </InputWithInfoInputContainer>
              <InputWithInfoInfoContainer>
                <Alert icon={<HelpIcon />} severity={'success'}>
                  <AlertTitle>How is this used?</AlertTitle>
                  Your Restaurant name is what shows up in the search for deals
                  and restaurants, if you are a chain, when you add multiple
                  locations the name will show up followed by the locations
                  provided nickname in brackets. e.g -{' '}
                  <strong>Rudy's (Ancoats Sq)</strong>
                </Alert>
              </InputWithInfoInfoContainer>
            </InputWithInfoStack>
            <Subheader
              text={'Add your restaurants social media links (optional)'}
            />
            <InputStack sx={{ marginBottom: 2 }}>
              <RHFTextField
                variant={'filled'}
                name="social_media.instagram"
                label="Instagram URL (optional)"
              />
              <RHFTextField
                variant={'filled'}
                name="social_media.facebook"
                label="Facebook URL (optional)"
              />
            </InputStack>
            <InputStack sx={{ marginTop: 0 }}>
              <RHFTextField
                variant={'filled'}
                name="social_media.tiktok"
                label="TikTok URL (optional)"
              />
              <RHFTextField
                variant={'filled'}
                name="social_media.linkedin"
                label="LinkedIn URL (optional)"
              />
            </InputStack>
            {/* ACTIONS */}
            <Box mt={4} sx={{ display: 'flex' }}>
              <Button color="inherit" onClick={onCancel}>
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
          </FormProvider>
        </Box>
      </Container>
    </>
  );
};

export default RestaurantEdit;
