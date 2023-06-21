import { Box, styled } from '@mui/material';

export const ExpandableWrapper = styled(Box, {
  shouldForwardProp: (p) => p !== 'expanded'
})(({ expanded }) => ({
  display: 'grid',
  gridTemplateRows: expanded ? '1fr' : '0fr',
  overflow: 'hidden',
  transition: 'grid-template-rows 300ms'
}));

export const ExpandableContentContainer = styled(Box)(() => ({
  minHeight: '0px'
}));
