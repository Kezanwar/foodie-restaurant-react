import { createContext, useMemo } from 'react';

import useBatteryLow from 'hooks/useBatteryLow';

// ----------------------------------------------------------------------

export const UtilityContext = createContext(null);

const userLocale = (
  new Intl.NumberFormat().resolvedOptions().locale || 'en-GB'
).split('-');

let locale;

import('date-fns/locale').then((locales) => {
  locale = locales[`${userLocale[0]}${userLocale[1]}`];
});

// ----------------------------------------------------------------------

const UtilityProvider = ({ children }) => {
  const isBatteryLow = useBatteryLow();

  const value = useMemo(
    () => ({ isBatteryLow, locale }),
    [isBatteryLow, locale]
  );

  return (
    <UtilityContext.Provider value={value}>{children}</UtilityContext.Provider>
  );
};

export default UtilityProvider;
