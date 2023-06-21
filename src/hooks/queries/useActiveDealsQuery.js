import { useCallback } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import {
  DEALS_QUERY,
  cacheValues
} from '../../constants/react-query.constants';
import { getActiveDeals } from '../../utils/api';

const useActiveDealsQuery = () => {
  const queryClient = useQueryClient();
  const query = useQuery(DEALS_QUERY.ACTIVE_DEALS, () => getActiveDeals(), {
    enabled: true,
    ...cacheValues
  });

  const updateQuery = useCallback((data) => {
    queryClient.setQueryData(DEALS_QUERY.ACTIVE_DEALS, (oldData) => {
      return {
        ...oldData,
        data
      };
    });
  }, []);

  const invalidateQuery = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [DEALS_QUERY.ACTIVE_DEALS]
    });
  });

  query.invalidateQuery = invalidateQuery;

  query.updateQuery = updateQuery;
  return query;
};

export default useActiveDealsQuery;
