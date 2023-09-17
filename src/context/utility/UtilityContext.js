import { createContext, useMemo } from 'react';

import useBatteryLow from '../../hooks/useBatteryLow';
import useClientLocation from '../../hooks/useClientLocation';

// ----------------------------------------------------------------------

export const UtilityContext = createContext(null);

// ----------------------------------------------------------------------

const UtilityProvider = ({ children }) => {
  const isBatteryLow = useBatteryLow();
  const clientLocation = useClientLocation();

  const value = useMemo(
    () => ({ isBatteryLow, clientLocation }),
    [isBatteryLow, clientLocation]
  );

  return (
    <UtilityContext.Provider value={value}>{children}</UtilityContext.Provider>
  );
};

export default UtilityProvider;
