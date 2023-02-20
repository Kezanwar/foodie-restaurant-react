import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Autocomplete } from '@mui/material';

// ----------------------------------------------------------------------

RHFAutocomplete.propTypes = {
  name: PropTypes.string,
};

export default function RHFAutocomplete({ name, ...other }) {
  const { control } = useFormContext();

  return <Controller name={name} control={control} render={({ field }) => <Autocomplete {...field} {...other} />} />;
}
