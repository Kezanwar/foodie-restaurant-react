import { SUBSCRIPTION_QUERY } from 'constants/react-query';
import { useQuery } from '@tanstack/react-query';
import { getSubscription } from 'lib/api';

const useSubscriptionQuery = () => {
  return useQuery({
    queryKey: [SUBSCRIPTION_QUERY.SUB],
    queryFn: getSubscription,
    staleTime: 10 * 1000 * 60,
    cacheTime: 10 * 1000 * 60
  });
};

export default useSubscriptionQuery;
