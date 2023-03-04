import React, { useEffect, useMemo } from 'react';
import { m } from 'framer-motion';
import {
  Alert,
  AlertTitle,
  Autocomplete,
  Box,
  Button,
  Stack,
  TextField
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import AddIcon from '@mui/icons-material/Add';
import PropTypes from 'prop-types';
import Subheader from '../../../components/subheader/Subheader';
import {
  FormSectionStack,
  InputWithInfoInfoContainer,
  InputWithInfoInputContainer,
  InputWithInfoStack
} from '../styles';
import { RHFCheckbox, RHFTextField } from '../../../components/hook-form';
import AvailabilityIndicator from '../../../components/availability-indicator/AvailabilityIndicator';
import useCustomMediaQueries from '../../../hooks/useCustomMediaQueries';
import { countries, countryToFlag } from '../../../assets/data';
import {
  RHFUpload,
  RHFUploadAvatar
} from '../../../components/hook-form/RHFUpload';
import RouterLink from '../../../components/router-link/RouterLink';
import { pageScrollToTop } from '../../../utils/scroll';
import { varFade } from '../../../components/animate';
import Spacer from '../../../components/spacer/Spacer';

const NewRestaurantCreateRestaurant = (props) => {
  const { isTablet, isMobile } = useCustomMediaQueries();
  const alertButtonSx = useMemo(
    () => ({
      marginTop: !isMobile ? 1 : 0,
      marginLeft: isMobile ? 1 : 0
    }),
    [isMobile]
  );

  useEffect(() => {
    pageScrollToTop();
  }, []);

  return (
    <m.div variants={varFade().in}>
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
            Your Restaurant name is what shows up in the search for vouchers and
            restaurants, if you are a chain, when you add multiple locations the
            name will show up followed by the locations provided nickname in
            brackets. e.g - <strong>Rudy's (Ancoats Sq)</strong>
          </Alert>
        </InputWithInfoInfoContainer>
      </InputWithInfoStack>

      {/* <Subheader
        sx={{ padding: 0, marginBottom: 16 }}
        text={'Choose a unique URL for your store'}
      />

      <FormSectionStack>
        <Alert icon={<HelpIcon />} severity={'success'}>
          <AlertTitle>Why do we need this?</AlertTitle>
          For customers to be able to reach your store using a unique URL.
        </Alert>
      </FormSectionStack> */}
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
            Your Restaurant Avatar acts as a profile image for your Restaurant,
            your cover photo is used as the back drop.
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
      <FormSectionStack sx={{ marginBottom: 2 }} mobSx={{ marginBottom: 16 }}>
        <RHFTextField
          variant={'filled'}
          name="social_media.instagram"
          label="Instagram URL (optional)"
        />{' '}
        <RHFTextField
          variant={'filled'}
          name="social_media.facebook"
          label="Facebook URL (optional)"
        />{' '}
      </FormSectionStack>
      <FormSectionStack sx={{ marginTop: 0 }}>
        <RHFTextField
          variant={'filled'}
          name="social_media.tiktok"
          label="TikTok URL (optional)"
        />{' '}
        <RHFTextField
          variant={'filled'}
          name="social_media.linkedin"
          label="LinkedIn URL (optional)"
        />
      </FormSectionStack>
    </m.div>
  );
};

NewRestaurantCreateRestaurant.propTypes = {};

export default NewRestaurantCreateRestaurant;
