import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { LOCATIONS_QUERY, cacheValues } from 'constants/react-query';
import { getLocations } from 'lib/api';

const useLocationsQuery = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [LOCATIONS_QUERY.LOCATIONS],
    queryFn: getLocations,
    enabled: true,
    select: (data) => data.data,
    ...cacheValues
  });

  const updateQuery = useCallback(
    (data) => {
      queryClient.setQueryData([LOCATIONS_QUERY.LOCATIONS], () => {
        return data;
      });
    },
    [queryClient]
  );

  const invalidateQuery = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [LOCATIONS_QUERY.LOCATIONS]
    });
  }, [queryClient]);

  return {
    ...query,
    invalidateQuery,
    updateQuery
  };
};

export default useLocationsQuery;
