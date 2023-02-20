import { useMediaQuery } from '@mui/material';

const useCustomMediaQueries = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery((theme) => theme.breakpoints.down('md'));
  return { isMobile, isTablet };
};

export default useCustomMediaQueries;
