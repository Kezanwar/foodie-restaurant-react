import { SUBSCRIPTION_QUERY } from 'constants/react-query';
import { useQuery } from 'react-query';
import { getSubscription } from 'utils/api';

const useSubscriptionQuery = () => {
  const query = useQuery(SUBSCRIPTION_QUERY.SUB, () => getSubscription(), {
    staleTime: 10 * 1000 * 60,
    cacheTime: 10 * 1000 * 60
  });

  return query;
};

export default useSubscriptionQuery;
