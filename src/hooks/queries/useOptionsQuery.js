import { useQuery } from 'react-query';
import { OPTIONS_QUERY } from '../../constants/react-query.constants';
import { getOptions } from '../../utils/api';

const useOptionsQuery = () => {
  // const queryClient = useQueryClient();
  const query = useQuery(OPTIONS_QUERY, () => getOptions(), {
    enabled: true,
    staleTime: 60 * (60 * 1000),
    cacheTime: 120 * (60 * 1000)
  });

  // const updateQuery = useCallback((data) => {
  //   queryClient.setQueryData(RESTAURANT_QUERY.RESTAURANT, (oldData) => {
  //     return {
  //       ...oldData,
  //       data
  //     };
  //   });
  // }, []);

  // query.updateQuery = updateQuery;

  return query;
};

export default useOptionsQuery;
