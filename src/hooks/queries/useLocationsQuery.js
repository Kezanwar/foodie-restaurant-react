import { useCallback } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { LOCATIONS_QUERY } from '../../constants/react-query.constants';
import { getLocations } from '../../utils/api';

const useLocationsQuery = () => {
  const queryClient = useQueryClient();
  const query = useQuery(LOCATIONS_QUERY.LOCATIONS, () => getLocations(), {
    enabled: true
  });

  const updateQuery = useCallback((data) => {
    queryClient.setQueryData(LOCATIONS_QUERY.LOCATIONS, (oldData) => {
      return {
        ...oldData,
        data
      };
    });
  }, []);

  query.updateQuery = updateQuery;
  return query;
};

export default useLocationsQuery;
