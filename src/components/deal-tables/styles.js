import { Box, styled } from '@mui/material';
import Subheader from 'components/subheader/Subheader';

export const CustomHeaderCell = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 12,
  textTransform: 'uppercase',
  fontWeight: 900,
  color: theme.palette.text.primary,
  padding: 0,
  '& svg': {
    height: '1.25rem',
    marginRight: '0.25rem',
    marginLeft: '-0.225rem'
  }
  // [theme.breakpoints.down(768)]: {
  //   '& svg': {
  //     display: 'none'
  //   }
  // }
}));

export const TableColumnHeaderText = ({ text }) => {
  return <Subheader text={text} mb={0} />;
};
