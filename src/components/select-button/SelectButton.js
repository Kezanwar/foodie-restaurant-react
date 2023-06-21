import { Button, styled } from '@mui/material';

export const SelectButton = styled(Button, {
  shouldForwardProp: (p) => p !== 'isSelected'
})(({ theme, isSelected }) => ({
  padding: theme.spacing(1.5),
  borderWidth: isSelected ? '2px!important' : '1px',
  fontWeight: isSelected ? '800' : '500'
}));
