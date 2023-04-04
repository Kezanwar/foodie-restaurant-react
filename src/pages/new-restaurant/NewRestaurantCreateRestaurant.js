import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { m } from 'framer-motion';
import PropTypes from 'prop-types';
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
  InputWithInfoInfoContainer,
  InputWithInfoInputContainer,
  InputWithInfoStack
} from '../../sections/forms/styles';

import { restaurantDetailsSchema } from '../../validation/new-restaurant.validation';

import FormProvider from '../../components/hook-form/FormProvider';
import {
  RHFUpload,
  RHFUploadAvatar
} from '../../components/hook-form/RHFUpload';
import useCustomMediaQueries from '../../hooks/useCustomMediaQueries';
import useRestaurantQuery from '../../hooks/queries/useRestaurantQuery';
import { PATH_NEW_RESTAURANT } from '../../routes/paths';
import { postRestaurantDetails } from '../../utils/api';
import { getFormDataFromObject } from '../../utils/formData';
import MotionDivViewport from '../../components/animate/MotionDivViewport';
import useOptionsQuery from '../../hooks/queries/useOptionsQuery';
import RHFMultipleAutocomplete from '../../components/hook-form/RHFMultipleAutoComplete';

const NewRestaurantCreateRestaurant = (props) => {
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const { data, updateQuery } = useRestaurantQuery();
  const options = useOptionsQuery();

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

  const updateCountry = useCallback(
    (val) => {
      setValue('company_address.country', val);
    },
    [methods]
  );

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
      updateQuery(updatedRestaurant?.data);
      handleNext();
    } catch (error) {
      console.error(error);

      setError('afterSubmit', {
        ...error,
        message: error.message
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

  return (
    <>
      <Helmet>
        <title> Step 2 | Foodie</title>
      </Helmet>

      <MotionDivViewport
        layout={'preserve-aspect'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Subheader
            sx={{ padding: 0, marginBottom: 16 }}
            text={'your restaurants name'}
          />

          <InputWithInfoStack>
            <InputWithInfoInputContainer>
              <RHFTextField
                sx={{ flex: 1 }}
                name="name"
                label="Add your restaurant name"
                variant={'filled'}
              />
              <Box flex={isTablet ? 0.7 : 1} display={'flex'}>
                {/* {storeName && (
            <AvailabilityIndicator
              success={storeNameAvailable}
              resultName={'name'}
              isLoading={nameAvailabilityLoading}
            />
          )} */}
              </Box>
            </InputWithInfoInputContainer>
            <InputWithInfoInfoContainer>
              <Alert icon={<HelpIcon />} severity={'success'}>
                <AlertTitle>How is this used?</AlertTitle>
                Your Restaurant name is what shows up in the search for vouchers
                and restaurants, if you are a chain, when you add multiple
                locations the name will show up followed by the locations
                provided nickname in brackets. e.g -{' '}
                <strong>Rudy's (Ancoats Sq)</strong>
              </Alert>
            </InputWithInfoInfoContainer>
          </InputWithInfoStack>

          <Subheader
            sx={{ padding: 0, marginBottom: 16 }}
            text={'Upload your Restaurant Avatar'}
          />
          <InputWithInfoStack>
            <InputWithInfoInputContainer
              sx={{
                '& > *': {
                  '& > *': {
                    margin: 'unset!important'
                  }
                },
                '& .MuiFormHelperText-root': {
                  textAlign: 'left'
                }
              }}
            >
              <RHFUploadAvatar margin={0} name="avatar" label="" />
            </InputWithInfoInputContainer>
            <InputWithInfoInfoContainer>
              <Alert icon={<HelpIcon />} severity={'success'}>
                <AlertTitle>Where are these images shown?</AlertTitle>
                Your Restaurant Avatar acts as a profile image for your
                Restaurant, your cover photo is used as the back drop.
                <Box mt={1}>
                  If an image isn't provided for a new voucher, the voucher
                  image will default to your Restaurant Cover Photo.
                </Box>
                <Box mt={1}>
                  Images can be updated <strong>at any time.</strong>
                </Box>
              </Alert>
            </InputWithInfoInfoContainer>
          </InputWithInfoStack>

          <Subheader
            sx={{ padding: 0, marginBottom: 16 }}
            text={'Upload your restaurant cover photo'}
          />
          <FormSectionStack>
            <RHFUpload name="cover_photo" label="" />
          </FormSectionStack>
          <Spacer />
          <Subheader
            sx={{ padding: 0, marginBottom: 16 }}
            text={'Add your cuisines (Choose multiple or one)'}
          />

          <InputWithInfoStack>
            <InputWithInfoInputContainer>
              {cuisineOptions && (
                <RHFMultipleAutocomplete
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
            sx={{ padding: 0, marginBottom: 16 }}
            text={
              'Add dietary requirements you cater for (Choose multiple or one)'
            }
          />

          <InputWithInfoStack>
            <InputWithInfoInputContainer>
              {dietaryOptions && (
                <RHFMultipleAutocomplete
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
            sx={{ padding: 0, marginBottom: 16 }}
            text={'Add a bio for customers to read (Max 500 characters)'}
          />
          <FormSectionStack>
            <RHFTextField
              multiline
              variant={'filled'}
              rows={4}
              name="bio"
              label="Enter your restaurant biography"
            />
          </FormSectionStack>
          <Spacer />
          <Subheader
            sx={{ padding: 0, marginBottom: 16 }}
            text={'Add your restaurants social media links (optional)'}
          />
          <FormSectionStack
            sx={{ marginBottom: 2 }}
            mobSx={{ marginBottom: 16 }}
          >
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
          </FormSectionStack>
          <FormSectionStack sx={{ marginTop: 0 }}>
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
          </FormSectionStack>
          {/* ACTIONS */}
          <Box mt={4} sx={{ display: 'flex' }}>
            <Button color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
            <Button
              color="inherit"
              onClick={() => console.log(getValues())}
              sx={{ mr: 1 }}
            >
              values
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
      </MotionDivViewport>
    </>
  );
};

NewRestaurantCreateRestaurant.propTypes = {};

export default React.memo(NewRestaurantCreateRestaurant);