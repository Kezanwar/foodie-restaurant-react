import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, styled, useTheme } from '@mui/material';
import { capitalize } from 'lodash';

import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import BookmarkAddedOutlinedIcon from '@mui/icons-material/BookmarkAddedOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import MouseOutlinedIcon from '@mui/icons-material/MouseOutlined';
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

const StatCardDashboard = React.memo(({ name, value }) => {
  const {
    palette: { mode }
  } = useTheme();

  const title = name
    ? name
        .split('_')
        .map((l) => capitalize(l))
        .join(' ')
    : '';

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
          desc: 'Total deal unique views'
        };
      case 'Booking Clicks':
        return {
          titleIcon: (
            <TitleIconWrapper
              backgroundColor={
                mode === 'light' ? 'warning.lighter' : 'transparent'
              }
            >
              <MouseOutlinedIcon color="warning" />
            </TitleIconWrapper>
          ),
          desc: 'Total book now clicks'
        };
      case 'Followers':
        return {
          titleIcon: (
            <TitleIconWrapper
              backgroundColor={
                mode === 'light' ? 'error.lighter' : 'transparent'
              }
            >
              <FavoriteBorderOutlinedIcon color="error" />
            </TitleIconWrapper>
          ),
          desc: 'Total restaurant followers'
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
          desc: 'Total deal views'
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
          desc: 'Total deal favourites'
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
    </StatCardWrapperStyled>
  );
});

StatCardDashboard.propTypes = {
  name: PropTypes.string,

  value: PropTypes.number
};

export default StatCardDashboard;
