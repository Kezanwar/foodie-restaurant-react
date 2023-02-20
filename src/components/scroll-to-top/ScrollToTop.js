import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pageScrollToTop } from '../../utils/scroll';

// ----------------------------------------------------------------------

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    pageScrollToTop();
  }, [pathname]);

  return null;
}
