import { useQuery } from '@tanstack/react-query';
import { OPTIONS_QUERY } from 'constants/react-query';
import { getOptions } from 'lib/api';

const useOptionsQuery = () => {
  return useQuery({
    queryKey: [OPTIONS_QUERY],
    queryFn: getOptions,
    enabled: true,
    staleTime: 60 * 60 * 1000, // 1 hour
    cacheTime: 120 * 60 * 1000 // 2 hours
  });
};

export default useOptionsQuery;
