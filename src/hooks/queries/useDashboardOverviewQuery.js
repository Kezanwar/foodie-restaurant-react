import { useQuery } from '@tanstack/react-query';
import { DASHBOARD_QUERY, cacheValues } from 'constants/react-query';
import { getDashboardOverview } from 'lib/api';

const useDashboardOverviewQuery = () => {
  return useQuery({
    queryKey: [DASHBOARD_QUERY.OVERVIEW],
    queryFn: getDashboardOverview,
    enabled: true,
    ...cacheValues
  });
};

export default useDashboardOverviewQuery;
