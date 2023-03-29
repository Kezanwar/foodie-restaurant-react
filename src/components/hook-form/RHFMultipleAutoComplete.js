import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Autocomplete, FormHelperText, TextField } from '@mui/material';

// ----------------------------------------------------------------------

RHFMultipleAutocomplete.propTypes = {
  name: PropTypes.string
};

export default function RHFMultipleAutocomplete({
  name,
  options,
  label,
  placeholder,
  ...other
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        return (
          <>
            <Autocomplete
              multiple
              fullWidth
              options={options}
              value={value}
              getOptionLabel={(option) => option.name}
              filterSelectedOptions
              onChange={(e, values) => onChange(values)}
              renderInput={(params) => (
                <TextField
                  error={!!error}
                  {...params}
                  label={label}
                  placeholder={placeholder}
                />
              )}
            />
            {!!error && (
              <FormHelperText error sx={{ px: 2 }}>
                {error.message}
              </FormHelperText>
            )}
          </>
        );
      }}
    />
  );
}
