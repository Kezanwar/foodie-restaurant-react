import { styled } from '@mui/material';
import Label from 'components/label';
import React from 'react';

const labelCols = {
  individual: 'secondary',
  premium: 'success',
  enterprise: 'primary'
};

export const StyledLabel = styled(Label)(({ theme }) => ({
  fontSize: 12,
  //   textTransform: 'uppercase',
  borderRadius: '50px',
  padding: theme.spacing(0.5, 1.25)
}));

const PlanLabel = ({ plan }) => {
  return <StyledLabel color={labelCols[plan]}>{plan}</StyledLabel>;
};

export default PlanLabel;
