import { useQuery } from 'react-query';
import { DASHBOARD_QUERY, cacheValues } from 'constants/react-query';
import { getDashboardOverview } from 'utils/api';

const useDashboardOverviewQuery = () => {
  const query = useQuery(
    DASHBOARD_QUERY.OVERVIEW,
    () => getDashboardOverview(),
    {
      enabled: true,
      ...cacheValues
    }
  );

  return query;
};

export default useDashboardOverviewQuery;
