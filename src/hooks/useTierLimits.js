import { useMemo } from 'react';
import useActiveDealsQuery from './queries/useActiveDealsQuery';
import useLocationsQuery from './queries/useLocationsQuery';

import Permissions from 'lib/permissions';
import useAuthStore from 'stores/auth';

const useTierLimits = () => {
  const activeDeals = useActiveDealsQuery();
  const locations = useLocationsQuery();

  const user = useAuthStore((state) => state.user);

  const limits = useMemo(() => {
    return {
      locations: {
        limit: Permissions.getLocationLimit(
          user?.subscription?.subscription_tier || 0
        ),
        current: locations.data?.data?.filter((l) => !l.archived)?.length || 0
      },
      deals: {
        limit: Permissions.getDealLimit(
          user?.subscription?.subscription_tier,
          locations.data?.data?.length || 0
        ),
        current: activeDeals.data?.data?.length || 0
      },
      isLoading: activeDeals.isLoading || locations.isLoading
    };
  }, [
    user?.subscription?.subscription_tier,
    locations.data?.data,
    activeDeals.data?.data,
    activeDeals.isLoading,
    locations.isLoading
  ]);

  return limits;
};

export default useTierLimits;
