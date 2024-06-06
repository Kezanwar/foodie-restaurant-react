import { useQuery } from 'react-query';
import { DEALS_QUERY, cacheValues } from 'constants/react-query';
import { getActiveDeals } from 'utils/api';

const useActiveDealsQuery = () => {
  // const queryClient = useQueryClient();
  const query = useQuery(DEALS_QUERY.ACTIVE_DEALS, () => getActiveDeals(), {
    enabled: true,
    ...cacheValues
  });

  // const invalidateQuery = useCallback(() => {
  //   queryClient.invalidateQueries({
  //     queryKey: [DEALS_QUERY.ACTIVE_DEALS]
  //   });
  // });

  // query.invalidateQuery = invalidateQuery;

  return query;
};

export default useActiveDealsQuery;
