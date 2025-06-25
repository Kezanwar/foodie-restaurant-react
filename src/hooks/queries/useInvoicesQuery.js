import { SUBSCRIPTION_QUERY } from 'constants/react-query';
import { useQuery } from '@tanstack/react-query';
import { getInvoices } from 'lib/api';

const useInvoicesQuery = () => {
  return useQuery({
    queryKey: [SUBSCRIPTION_QUERY.INVOICES],
    queryFn: getInvoices,
    staleTime: 10 * 1000 * 60,
    cacheTime: 10 * 1000 * 60
  });
};

export default useInvoicesQuery;
