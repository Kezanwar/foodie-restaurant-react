import React, { useEffect } from 'react';
import { m } from 'framer-motion';
import PropTypes from 'prop-types';
import {
  Alert,
  AlertTitle,
  Autocomplete,
  TextField,
  Typography
} from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { Box } from '@mui/system';
import HelpIcon from '@mui/icons-material/Help';

import Subheader from '../../../components/subheader/Subheader';
import { RHFTextField } from '../../../components/hook-form';

import {
  FormSectionStack,
  InputWithInfoInfoContainer,
  InputWithInfoInputContainer,
  InputWithInfoStack
} from '../styles';

import { countries, countryToFlag } from '../../../assets/data';
import { pageScrollToTop } from '../../../utils/scroll';
import { varFade } from '../../../components/animate';
import Spacer from '../../../components/spacer/Spacer';

const NewRestaurantCompanyInfo = (props) => {
  const { getFieldState, setValue } = useFormContext();

  const updateCountry = (val) => {
    setValue('company_address.country', val);
  };

  useEffect(() => {
    pageScrollToTop();
  }, []);

  return (
    <m.div variants={varFade().in}>
      <Subheader
        sx={{ padding: 0, marginBottom: 16 }}
        text={'Company Information'}
      />
      <FormSectionStack>
        <RHFTextField
          variant={'filled'}
          name="company_name"
          label="Registered company name"
        />
        <RHFTextField
          variant={'filled'}
          name="company_number"
          label="Company number (Optional)"
        />
      </FormSectionStack>
      <Spacer />
      <Subheader
        sx={{ padding: 0, marginBottom: 16 }}
        text={'Company office address'}
      />
      <InputWithInfoStack>
        <InputWithInfoInputContainer>
          <Box mb={2}>
            <RHFTextField
              variant={'filled'}
              name="company_address.address_line_1"
              label="Address line 1"
            />
          </Box>
          <Box mb={2}>
            <RHFTextField
              variant={'filled'}
              name="company_address.address_line_2"
              label="Address line 2 (Optional)"
            />
          </Box>
          <Box mb={2}>
            <RHFTextField
              variant={'filled'}
              name="company_address.postcode"
              label="Post / Zip code"
            />
          </Box>
          <Box mb={2}>
            <RHFTextField
              variant={'filled'}
              name="company_address.city"
              label="City"
            />
          </Box>
          <Box mb={2}>
            <Autocomplete
              defaultValue={countries.find((c) => c.label === 'United Kingdom')}
              fullWidth
              autoHighlight
              options={countries}
              getOptionLabel={(option) => option.label}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  value={option.label}
                  {...props}
                  sx={{ px: '8px !important' }}
                >
                  <Box
                    component="span"
                    sx={{ flexShrink: 0, mr: 2, fontSize: 22 }}
                  >
                    {countryToFlag(option.code)}
                  </Box>
                  {option.label} ({option.code}) +{option.phone}
                  <input value={option.label} style={{ display: 'none' }} />
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  label={'Country'}
                  variant={'filled'}
                  {...params}
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'disabled'
                  }}
                  onBlur={(e) => updateCountry(e.target.value)}
                  onChange={(e) => updateCountry(e.target.value)}
                />
              )}
            />
            {getFieldState('company_address.country')?.error?.message && (
              <Typography fontSize={12} mt={1} pl={2} color={'error'}>
                {getFieldState('company_address.country')?.error?.message}
              </Typography>
            )}
          </Box>
        </InputWithInfoInputContainer>
        <InputWithInfoInfoContainer>
          <Alert icon={<HelpIcon />} severity={'success'}>
            <AlertTitle>Why do we need this?</AlertTitle>
            We use the information taken on this step to confirm your
            authenticity as a restaurant, thus ensuring a level of safety is met
            for our customers.
          </Alert>
        </InputWithInfoInfoContainer>
      </InputWithInfoStack>
    </m.div>
  );
};

NewRestaurantCompanyInfo.propTypes = {};

export default React.memo(NewRestaurantCompanyInfo);
