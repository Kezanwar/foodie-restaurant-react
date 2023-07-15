import { useMediaQuery } from '@mui/material';
import { useMemo } from 'react';

const useCustomMediaQueries = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const memo = useMemo(() => {
    return { isMobile, isTablet };
  }, [isMobile, isTablet]);

  return memo;
};

export default useCustomMediaQueries;
