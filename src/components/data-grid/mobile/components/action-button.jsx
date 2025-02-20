import { CardActionArea, styled } from '@mui/material';
import React from 'react';

const MobileActionButton = styled(CardActionArea)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius
}));

export default MobileActionButton;
