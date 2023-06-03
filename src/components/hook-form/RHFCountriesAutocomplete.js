import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Autocomplete, Box, TextField } from '@mui/material';
import { countries, countryToFlag } from '../../assets/data';

// ----------------------------------------------------------------------

RHFCountriesAutocomplete.propTypes = {
  name: PropTypes.string
};

export default function RHFCountriesAutocomplete({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <Autocomplete
            isOptionEqualToValue={(option, value) =>
              option.label === value.label
            }
            fullWidth
            ref={field?.ref}
            name={name}
            value={field?.value}
            options={countries}
            onChange={(event, newValue) => {
              field.onChange(newValue);
            }}
            onBlur={field.onBlur}
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
                <input
                  readOnly
                  value={option.label}
                  style={{ display: 'none' }}
                />
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                variant={'filled'}
                {...params}
                label="Country"
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'disabled'
                }}
                placeholder="Start typing or click the dropdown"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        );
      }}
    />
  );
}
