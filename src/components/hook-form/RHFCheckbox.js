import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText
} from '@mui/material';

// ----------------------------------------------------------------------

RHFCheckbox.propTypes = {
  name: PropTypes.string
};

export function RHFCheckbox({ name, isCentered, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error }, formState }) => {
        return (
          <Box>
            <FormControlLabel
              control={<Checkbox {...field} checked={!!field.value} />}
              {...other}
            />
            {!!error && (
              <Box
                sx={
                  isCentered
                    ? {
                        display: 'flex',
                        backgroudColor: 'black',
                        justifyContent: 'center'
                      }
                    : {}
                }
              >
                <FormHelperText error sx={{ px: 2 }}>
                  {error.message}
                </FormHelperText>
              </Box>
            )}
          </Box>
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

RHFMultiCheckbox.propTypes = {
  name: PropTypes.string,
  options: PropTypes.array
};

export function RHFMultiCheckbox({ name, options, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const onSelected = (option) =>
          field.value.includes(option)
            ? field.value.filter((value) => value !== option)
            : [...field.value, option];

        return (
          <FormGroup>
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={field.value.includes(option.value)}
                    onChange={() => field.onChange(onSelected(option.value))}
                  />
                }
                label={option.label}
                {...other}
              />
            ))}
          </FormGroup>
        );
      }}
    />
  );
}
