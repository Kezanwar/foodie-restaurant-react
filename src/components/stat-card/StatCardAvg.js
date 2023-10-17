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

export const AvgDayContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: '2px',
  borderStyle: 'solid'
}));

const StatCardAvg = React.memo(({ title, avg_per_day, value }) => {
  const {
    palette: { mode }
  } = useTheme();

  const titleIconDesc = () => {
    switch (title) {
      case 'Impressions':
        return {
          titleIcon: (
            <TitleIconWrapper
              backgroundColor={
                mode === 'light' ? 'secondary.lighter' : 'transparent'
              }
            >
              <StarOutlineIcon color="secondary" />
            </TitleIconWrapper>
          ),
          desc: 'Total unique views'
        };
      case 'Views':
        return {
          titleIcon: (
            <TitleIconWrapper
              backgroundColor={
                mode === 'light' ? 'info.lighter' : 'transparent'
              }
            >
              <VisibilityOutlinedIcon
                sx={{ color: mode === 'light' ? 'info.main' : 'info.main' }}
              />
            </TitleIconWrapper>
          ),
          desc: 'Total view count'
        };

      case 'Favourites':
        return {
          titleIcon: (
            <TitleIconWrapper
              backgroundColor={
                mode === 'light' ? 'success.lighter' : 'transparent'
              }
            >
              <BookmarkAddedOutlinedIcon color="success" />
            </TitleIconWrapper>
          ),
          desc: 'Total user favourites'
        };
      default:
        return {
          titleIcon: '',
          desc: ''
        };
    }
  };

  const { desc, titleIcon } = titleIconDesc();

  return (
    <StatCardWrapperStyled title={title}>
      <Box
        display={'flex'}
        alignItems={'start'}
        justifyContent={'space-between'}
        gap={1}
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={600} fontSize={'18px!important'}>
            {title}
          </Typography>
          <Typography color={'text.secondary'} variant="body2">
            {desc}
          </Typography>
        </Box>

        {titleIcon}
      </Box>

      <Typography fontWeight={600} variant="h2">
        {value?.toLocaleString()}
      </Typography>
      <Box display={'flex'} alignItems={'center'} gap={1} mt={4} mb={1}>
        <Typography color={'text.secondary'} variant="body2">
          Avg per day: {avg_per_day?.toLocaleString()}
        </Typography>
      </Box>
    </StatCardWrapperStyled>
  );
});

StatCardAvg.propTypes = {
  title: PropTypes.string,
  avg_per_day: PropTypes.number,
  value: PropTypes.number
};

export default StatCardAvg;
