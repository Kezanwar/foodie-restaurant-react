import { SUBSCRIPTION_QUERY } from 'constants/react-query';
import { useQuery } from 'react-query';
import { getBilling } from 'utils/api';

const useBillingQuery = () => {
  const query = useQuery(SUBSCRIPTION_QUERY.BILLING, () => getBilling(), {
    staleTime: 10 * 1000 * 60,
    cacheTime: 10 * 1000 * 60
  });

  return query;
};

export default useBillingQuery;
