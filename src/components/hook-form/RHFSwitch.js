import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { Switch, FormControlLabel } from '@mui/material';

RHFSwitch.propTypes = {
  name: PropTypes.string
};

export default function RHFSwitch({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControlLabel
          control={<Switch {...field} checked={field.value} />}
          {...other}
        />
      )}
    />
  );
}
