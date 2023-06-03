import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router';
import {
  Alert,
  AlertTitle,
  Autocomplete,
  Button,
  TextField,
  Typography
} from '@mui/material';
import { Helmet } from 'react-helmet-async';

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
  InputStack,
  InputWithInfoInfoContainer,
  InputWithInfoInputContainer,
  InputWithInfoStack
} from '../../features/forms/styles';

import { restaurantDetailsSchema } from '../../validation/new-restaurant.validation';

import FormProvider from '../../components/hook-form/FormProvider';
import {
  RHFUpload,
  RHFUploadAvatar,
  RHFUploadWithCrop
} from '../../components/hook-form/RHFUpload';
import useCustomMediaQueries from '../../hooks/useCustomMediaQueries';
import useRestaurantQuery from '../../hooks/queries/useRestaurantQuery';
import { PATH_NEW_RESTAURANT } from '../../routes/paths';
import { postRestaurantDetails } from '../../utils/api';
import { getFormDataFromObject } from '../../utils/formData';
import MotionDivViewport from '../../components/animate/MotionDivViewport';
import useOptionsQuery from '../../hooks/queries/useOptionsQuery';
import RHFMultipleAutocomplete from '../../components/hook-form/RHFMultipleAutoComplete';
import useCreateRestaurantGuard from '../../hooks/useCreateRestaurantGuard';
import CustomTooltip from '../../components/custom-tooltip/CustomTooltip';
import { image_tooltip } from '../../constants/tooltips.constants';
import useRHFErrorMixpanelTracker from '../../hooks/useRHFErrorMixpanelTracker';
import { MIXPANEL_EVENTS, mixpanelTrack } from '../../utils/mixpanel';
import { useAuthContext } from '../../hooks/useAuthContext';

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

const NewRestaurantCreateRestaurant = (props) => {
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const { data, updateQuery } = useRestaurantQuery();
  const options = useOptionsQuery();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();

  useCreateRestaurantGuard(data?.data, PATH_NEW_RESTAURANT.step_2);

  const cuisineOptions = options?.data?.data?.cuisines;
  const dietaryOptions = options?.data?.data?.dietary_requirements;
  const optionsLoading = options?.isLoading;

  const defaultValues = useMemo(
    () => ({
      // company info
      name: data?.data?.name || '',
      avatar: data?.data?.avatar || null,
      cuisines: data?.data?.cuisines || [],
      dietary_requirements: data?.data?.dietary_requirements || [],
      is_new_avatar: !data?.data?.avatar,
      cover_photo: data?.data?.cover_photo || null,
      is_new_cover: !data?.data?.avatar,
      bio: data?.data?.bio || '',
      social_media: {
        instagram: data?.data?.social_media?.instagram || '',
        facebook: data?.data?.social_media?.facebook || '',
        tiktok: data?.data?.social_media?.tiktok || '',
        linkedin: data?.data?.social_media?.linkedin || ''
      }
    }),
    [
      data?.data?.name,
      data?.data?.avatar,
      data?.data?.cover_photo,
      data?.data?.cuisines,
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

  const {
    reset,
    setError,
    handleSubmit,
    watch,

    formState: { errors, isSubmitting, isSubmitSuccessful },
    getValues,
    getFieldState,
    setValue
  } = methods;

  useEffect(() => {
    pageScrollToTop();
  }, []);

  const navigate = useNavigate();

  const handleNext = () => {
    navigate(PATH_NEW_RESTAURANT.step_3);
  };

  const handleBack = () => {
    navigate(PATH_NEW_RESTAURANT.step_1);
  };

  const onSubmit = async (data) => {
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
        dietary_requirements
      } = data;
      setFormSubmitLoading(true);
      const formData = getFormDataFromObject({
        name,
        ...(is_new_avatar && { avatar }),
        ...(is_new_cover && { cover_photo }),
        cuisines,
        dietary_requirements,
        bio,
        social_media
      });
      const updatedRestaurant = await postRestaurantDetails(formData);
      mixpanelTrack(MIXPANEL_EVENTS.create_restaurant_rest_profile_success, {});
      updateQuery(updatedRestaurant.data);
      handleNext();
    } catch (error) {
      mixpanelTrack(MIXPANEL_EVENTS.create_restaurant_rest_profile_failed, {
        error: error?.mesage || JSON.stringify(error)
      });
      setError('afterSubmit', {
        ...error,
        message: error?.message || 'An unexpected error occured'
      });
    }
    setFormSubmitLoading(false);
  };

  const { isTablet } = useCustomMediaQueries();

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, setValue]);

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
      errArr.forEach(([name, value]) =>
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
    [user?.email]
  );

  return (
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
              Your Restaurant name is what shows up in the search for vouchers
              and restaurants, if you are a chain, when you add multiple
              locations the name will show up followed by the locations provided
              nickname in brackets. e.g - <strong>Rudy's (Ancoats Sq)</strong>
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
                If an image isn't provided for a new voucher, the voucher image
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
              Your restaurant cover photo acts as a backdrop for your restaurant
              profile screen and a fallback for vouchers if one isn't provided
              for them.
              <Box mt={1}>
                Images can be updated <strong>at any time.</strong>
              </Box>
            </Alert>
          </InputWithInfoInfoContainer>
        </InputWithInfoStack>

        <Spacer />
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
              Our mobile app allows your customers to favourite cuisine types
              and filter by cuisine within their searches.
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
          <Button color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
            Go Back
          </Button>

          <Box sx={{ flexGrow: 1 }} />
          <LoadingButton
            loading={formSubmitLoading}
            type="submit"
            variant="contained"
          >
            Next
          </LoadingButton>
        </Box>
      </FormProvider>
    </Box>
  );
};

NewRestaurantCreateRestaurant.propTypes = {};

export default NewRestaurantCreateRestaurant;
