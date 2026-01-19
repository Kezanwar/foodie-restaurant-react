import { useQuery } from '@tanstack/react-query';
import { DEALS_QUERY, cacheValues } from 'constants/react-query';
import { getActiveDeals } from 'lib/api';

const useActiveDealsQuery = () => {
  return useQuery({
    queryKey: [DEALS_QUERY.ACTIVE_DEALS],
    queryFn: getActiveDeals,
    enabled: true,
    select: (data) => data.data,
    ...cacheValues
  });
};

export default useActiveDealsQuery;
