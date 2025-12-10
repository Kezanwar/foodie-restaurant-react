import { useQuery } from '@tanstack/react-query';
import { DEALS_QUERY } from 'constants/react-query';
import { getSingleDeal } from 'lib/api';
import queryClient from 'lib/query-client';

const useSingleDealQuery = (id) => {
  return useQuery({
    queryKey: [DEALS_QUERY.SINGLE_DEAL, id],
    queryFn: () => getSingleDeal(id),
    enabled: !!id,
    select: (data) => data.data,
    staleTime: 10 * 1000 * 60,
    cacheTime: 10 * 1000 * 60
  });
};

export default useSingleDealQuery;

export const invalidateSingleDeal = async (id) => {
  if (!id) {
    await queryClient.invalidateQueries({
      queryKey: [DEALS_QUERY.SINGLE_DEAL],
      exact: false
    });
  } else {
    await queryClient.invalidateQueries({
      queryKey: [DEALS_QUERY.SINGLE_DEAL, id]
    });
  }
};
