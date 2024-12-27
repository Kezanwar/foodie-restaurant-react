import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { MenuItem, TextField } from '@mui/material';

RHFSelect.propTypes = {
  name: PropTypes.string,
  children: PropTypes.node
};

const selectProps = {
  sx: {
    '.MuiSelect-icon': { marginRight: 0.75 }
  }
};

export default function RHFSelect({ name, options, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <TextField
            SelectProps={selectProps}
            {...field}
            select
            fullWidth
            error={!!error}
            helperText={error?.message}
            {...other}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        );
      }}
    />
  );
}
