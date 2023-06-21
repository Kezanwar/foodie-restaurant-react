import { useCallback } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import {
  RESTAURANT_QUERY,
  cacheValues
} from '../../constants/react-query.constants';
import { getRestaurant } from '../../utils/api';

const useRestaurantQuery = () => {
  const queryClient = useQueryClient();
  const query = useQuery(RESTAURANT_QUERY.RESTAURANT, () => getRestaurant(), {
    enabled: true,
    ...cacheValues
  });

  const updateQuery = useCallback((data) => {
    queryClient.setQueryData(RESTAURANT_QUERY.RESTAURANT, (oldData) => {
      return {
        ...oldData,
        data
      };
    });
  }, []);

  query.updateQuery = updateQuery;

  return query;
};

export default useRestaurantQuery;
