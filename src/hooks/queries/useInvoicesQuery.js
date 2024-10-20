import { SUBSCRIPTION_QUERY } from 'constants/react-query';
import { useQuery } from 'react-query';
import { getInvoices } from 'utils/api';

const useInvoicesQuery = () => {
  const query = useQuery(SUBSCRIPTION_QUERY.INVOICES, () => getInvoices(), {
    staleTime: 10 * 1000 * 60,
    cacheTime: 10 * 1000 * 60
  });

  return query;
};

export default useInvoicesQuery;
