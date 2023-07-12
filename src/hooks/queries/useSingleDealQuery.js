import { useQuery } from 'react-query';
import { DEALS_QUERY } from '../../constants/react-query.constants';
import { getSingleDeal } from '../../utils/api';

const useSingleDealQuery = (id) => {
  const query = useQuery(
    `${DEALS_QUERY.SINGLE_DEAL}-${id}`,
    () => getSingleDeal(id),
    {
      enabled: !!id,
      staleTime: 10 * 1000 * 60,
      cacheTime: 10 * 1000 * 60
    }
  );

  return query;
};

export default useSingleDealQuery;
