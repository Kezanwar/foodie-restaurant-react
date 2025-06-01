import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DASHBOARD_QUERY, cacheValues } from 'constants/react-query';
import { getDashboardOverview } from 'lib/api';
import { useCallback } from 'react';

const useDashboardOverviewQuery = () => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: [DASHBOARD_QUERY.OVERVIEW],
    queryFn: getDashboardOverview,
    enabled: true,
    ...cacheValues
  });

  const invalidateQuery = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [DASHBOARD_QUERY.OVERVIEW]
    });
  }, [queryClient]);

  return { ...query, invalidateQuery };
};

export default useDashboardOverviewQuery;
