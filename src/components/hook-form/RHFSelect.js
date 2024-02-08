import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField } from '@mui/material';

RHFSelect.propTypes = {
  name: PropTypes.string,
  children: PropTypes.node
};

export default function RHFSelect({ name, children, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <TextField
            {...field}
            select
            fullWidth
            SelectProps={{ native: true }}
            error={!!error}
            helperText={error?.message}
            {...other}
          >
            {children}
          </TextField>
        );
      }}
    />
  );
}
