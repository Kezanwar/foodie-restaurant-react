import { createContext, useMemo } from 'react';

import useBatteryLow from 'hooks/useBatteryLow';

// ----------------------------------------------------------------------

export const UtilityContext = createContext(null);

// ----------------------------------------------------------------------

const UtilityProvider = ({ children }) => {
  const isBatteryLow = useBatteryLow();

  const value = useMemo(() => ({ isBatteryLow }), [isBatteryLow]);

  return (
    <UtilityContext.Provider value={value}>{children}</UtilityContext.Provider>
  );
};

export default UtilityProvider;
