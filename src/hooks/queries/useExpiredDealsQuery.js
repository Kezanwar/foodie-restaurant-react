import { useCallback } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import {
  DEALS_QUERY,
  cacheValues
} from '../../constants/react-query.constants';
import { getExpiredDeals } from '../../utils/api';

const useExpiredDealsQuery = () => {
  // const queryClient = useQueryClient();
  const query = useQuery(DEALS_QUERY.EXPIRED_DEALS, () => getExpiredDeals(), {
    enabled: true,
    ...cacheValues
  });

  // const invalidateQuery = useCallback(() => {
  //   queryClient.invalidateQueries({
  //     queryKey: [DEALS_QUERY.EXPIRED_DEALS]
  //   });
  // });

  // query.invalidateQuery = invalidateQuery;

  return query;
};

export default useExpiredDealsQuery;
