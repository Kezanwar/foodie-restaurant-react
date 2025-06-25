import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RESTAURANT_QUERY, cacheValues } from 'constants/react-query';
import { getRestaurant } from 'lib/api';

const useRestaurantQuery = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [RESTAURANT_QUERY.RESTAURANT],
    queryFn: getRestaurant,
    enabled: true,
    ...cacheValues
  });

  const updateQuery = useCallback(
    (data) => {
      queryClient.setQueryData([RESTAURANT_QUERY.RESTAURANT], (oldData) => ({
        ...oldData,
        data
      }));
    },
    [queryClient]
  );

  return {
    ...query,
    updateQuery
  };
};

export default useRestaurantQuery;
