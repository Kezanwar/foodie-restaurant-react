import { useQuery } from '@tanstack/react-query';
import { DEALS_QUERY, cacheValues } from 'constants/react-query';
import { getExpiredDeals } from 'lib/api';

const useExpiredDealsQuery = () => {
  return useQuery({
    queryKey: [DEALS_QUERY.EXPIRED_DEALS],
    queryFn: getExpiredDeals,
    enabled: true,
    ...cacheValues
  });
};

export default useExpiredDealsQuery;
