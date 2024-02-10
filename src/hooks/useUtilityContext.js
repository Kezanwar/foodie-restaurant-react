import { useContext } from 'react';
//

import { UtilityContext } from 'hocs/UtilityContext';
// import { AuthContext } from './Auth0Context';
// import { AuthContext } from './FirebaseContext';
// import { AuthContext } from './AwsCognitoContext';

// ----------------------------------------------------------------------

export const useUtilityContext = () => {
  const context = useContext(UtilityContext);

  if (!context)
    throw new Error(
      'useUtilityContext context must be use inside UtilityProvider'
    );

  return context;
};
