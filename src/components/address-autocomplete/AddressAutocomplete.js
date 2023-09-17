import PropTypes from 'prop-types';

import WorldAddressAutocomplete from './WorldAddressAutocomplete';
import UKAddressAutocomplete from './UKAddressAutocomplete';

import { useUtilityContext } from '../../hooks/useUtilityContext';

const AddressAutocomplete = ({ handleOnAddressSelect }) => {
  const { clientLocation } = useUtilityContext();

  return clientLocation === 'United Kingdom' ? (
    <UKAddressAutocomplete handleOnAddressSelect={handleOnAddressSelect} />
  ) : (
    <WorldAddressAutocomplete handleOnAddressSelect={handleOnAddressSelect} />
  );
};

AddressAutocomplete.propTypes = {
  handleOnAddressSelect: PropTypes.func
};

export default AddressAutocomplete;
