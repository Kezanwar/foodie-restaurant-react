import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, styled, useTheme } from '@mui/material';

import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import BookmarkAddedOutlinedIcon from '@mui/icons-material/BookmarkAddedOutlined';

import StarOutlineIcon from '@mui/icons-material/StarOutline';

import { StatCardWrapperStyled } from './styles';

export const TitleIconWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.5),
  borderRadius: '100%',
  aspectRatio: '1/1',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  svg: {
    height: '22px'
  }
}));

const StatCard = React.memo(({ title, percentage, value }) => {
  const {
    palette: { mode }
  } = useTheme();

  const config = () => {
    let status = 'neutral';
    if (percentage > 0) status = 'positive';
    if (percentage < 0) status = 'negative';

    switch (status) {
      case 'positive':
        return {
          icon: <TrendingUpIcon color="success" />,
          percentCol: 'success.main',
          percentSuffix: '+',
          text: 'Increase since last week'
        };
      case 'negative':
        return {
          icon: <TrendingDownIcon color="error" />,
          percentCol: 'error.main',
          percentSuffix: '',
          text: 'Decrease since last week'
        };
      default:
        return {
          icon: <TrendingUpIcon color="warning" />,
          percentCol: 'warning.main',
          percentSuffix: '',
          text: 'No change since last week'
        };
    }
  };

  const titleIcon = () => {
    switch (title) {
      case 'Impressions':
        return (
          <TitleIconWrapper
            backgroundColor={
              mode === 'light' ? 'secondary.lighter' : 'transparent'
            }
          >
            <StarOutlineIcon color="secondary" />
          </TitleIconWrapper>
        );
      case 'Views':
        return (
          <TitleIconWrapper
            backgroundColor={mode === 'light' ? 'info.lighter' : 'transparent'}
          >
            <VisibilityOutlinedIcon
              sx={{ color: mode === 'light' ? 'info.main' : 'info.main' }}
            />
          </TitleIconWrapper>
        );

      case 'Favourites':
        return (
          <TitleIconWrapper
            backgroundColor={
              mode === 'light' ? 'success.lighter' : 'transparent'
            }
          >
            <BookmarkAddedOutlinedIcon color="success" />
          </TitleIconWrapper>
        );
      default:
        return '';
    }
  };

  const { icon, percentCol, percentSuffix, text } = config();

  return (
    <StatCardWrapperStyled>
      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'space-between'}
        gap={1}
        mb={2}
      >
        <Typography variant="h6" fontWeight={600} fontSize={'18px!important'}>
          {title}
        </Typography>
        {titleIcon()}
      </Box>

      <Box display={'flex'} gap={1}>
        {icon}{' '}
        <Typography color={percentCol}>
          {percentSuffix}
          {percentage}%
        </Typography>
      </Box>
      <Typography my={2} color={'text.secondary'} variant="body2">
        {text}
      </Typography>

      <Typography fontWeight={600} variant="h2">
        {value.toLocaleString()}
      </Typography>
    </StatCardWrapperStyled>
  );
});

StatCard.propTypes = {
  title: PropTypes.string,
  percentage: PropTypes.number,
  value: PropTypes.number
};

export default StatCard;
