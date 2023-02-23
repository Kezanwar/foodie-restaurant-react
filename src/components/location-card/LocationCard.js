import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/system';
import { IconButton, Stack, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '@emotion/react';

import { LocationCardContainer } from './styles';

import SvgColor from '../svg-color/SvgColor';

const LocationCard = ({
  address_line_1,
  address_line_2,
  postcode,
  city,
  country,
  email,
  phone_number,
  nickname,
  onDelete
}) => {
  const theme = useTheme();
  return (
    <LocationCardContainer>
      <Box
        sx={{
          position: 'absolute',
          top: theme.spacing(2),
          right: theme.spacing(2),
          display: 'flex',
          gap: 0.5
        }}
      >
        <IconButton color="info" size="small">
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton onClick={onDelete} color="error" size="small">
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Box>

      <Stack
        sx={{
          gap: 0.25
        }}
        mb={2}
      >
        <Box margin={0} color={theme.palette.primary.main}>
          <SvgColor
            src={`/assets/icons/navbar/ic_store.svg`}
            sx={{ width: 24, height: 24 }}
          />
        </Box>
        <Typography variant="body2">{nickname}</Typography>
        <Typography variant="body2">{address_line_1}</Typography>
        <Typography variant="body2">{address_line_2}</Typography>
        <Typography variant="body2">{postcode}</Typography>
        <Typography variant="body2">{city}</Typography>
        <Typography variant="body2">{country}</Typography>
      </Stack>
      <Stack gap={0.25}>
        <Box margin={0} color={theme.palette.primary.main}>
          <SvgColor
            src={`/assets/icons/navbar/ic_chat.svg`}
            sx={{ width: 24, height: 24 }}
          />
        </Box>
        <Typography variant="body2">{email}</Typography>
        <Typography variant="body2">{phone_number}</Typography>
      </Stack>
    </LocationCardContainer>
  );
};

LocationCard.propTypes = {
  address_line_1: PropTypes.string,
  address_line_2: PropTypes.string,
  postcode: PropTypes.string,
  city: PropTypes.string,
  country: PropTypes.string,
  email: PropTypes.string,
  phone_number: PropTypes.string,
  nickname: PropTypes.string,
  onDelete: PropTypes.func
};

export default LocationCard;
