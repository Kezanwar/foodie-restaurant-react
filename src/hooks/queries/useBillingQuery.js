import { SUBSCRIPTION_QUERY } from 'constants/react-query';
import { useQuery } from '@tanstack/react-query';
import { getBilling } from 'lib/api';

const useBillingQuery = () => {
  return useQuery({
    queryKey: [SUBSCRIPTION_QUERY.BILLING],
    queryFn: getBilling,
    staleTime: 10 * 1000 * 60,
    cacheTime: 10 * 1000 * 60
  });
};

export default useBillingQuery;
