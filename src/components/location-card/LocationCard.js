/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/system';
import { IconButton, Stack, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '@emotion/react';
import { capitalize } from 'lodash';

import { EditIconsWrapper, LocationCardStyled } from './styles';

import SvgColor from '../svg-color/SvgColor';

import useRestaurantQuery from '../../hooks/queries/useRestaurantQuery';

const BodyText = ({ children }) => {
  return (
    <Typography color={'text.secondary'} variant="body2" fontSize={13}>
      {children}
    </Typography>
  );
};

const LocationCard = ({
  address: { address_line_1, address_line_2, postcode, city, country },
  email,
  phone_number,
  nickname,
  opening_times,
  _id,
  onDelete,
  onEdit
}) => {
  const theme = useTheme();

  const { data } = useRestaurantQuery();

  return (
    <LocationCardStyled key={`location-card-${_id}`} layout>
      <EditIconsWrapper>
        <IconButton onClick={() => onEdit(_id)} color="info" size="small">
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          onClick={() => onDelete(_id)}
          color="secondary"
          size="small"
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </EditIconsWrapper>

      <Stack
        sx={{
          gap: 0.25
        }}
        mb={2}
      >
        <Box mb={2} display={'flex'} alignItems={'flex-start'}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            color={theme.palette.primary.main}
          >
            <SvgColor
              src={`/assets/icons/navbar/ic_store.svg`}
              sx={{ width: 24, height: 24, marginLeft: -0.3 }}
            />
          </Box>

          <Typography
            ml={1}
            pr={5.5}
            fontWeight={600}
            fontSize={14}
            variant="body2"
          >
            {data?.data?.name} ({nickname})
          </Typography>
        </Box>

        <BodyText>{address_line_1}</BodyText>
        <BodyText>{address_line_2}</BodyText>
        <BodyText>{postcode}</BodyText>
        <BodyText>{city}</BodyText>
        <BodyText>{country}</BodyText>
      </Stack>
      <Stack mb={2} gap={0.25}>
        <Box mb={2} display={'flex'} alignItems={'center'}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            margin={0}
            color={theme.palette.primary.main}
          >
            <SvgColor
              src={`/assets/icons/navbar/ic_chat.svg`}
              sx={{ width: 24, height: 24, marginLeft: -0.3 }}
            />
          </Box>
          <Typography ml={1} fontWeight={600} fontSize={13} variant="body2">
            Contact Details
          </Typography>
        </Box>

        <BodyText>{email}</BodyText>
        <BodyText>{phone_number}</BodyText>
      </Stack>
      <Stack gap={0.25}>
        <Box mb={2} display={'flex'} alignItems={'center'}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            margin={0}
            color={theme.palette.primary.main}
          >
            <SvgColor
              src={`/assets/icons/navbar/ic_time.svg`}
              sx={{ width: 24, height: 24, marginLeft: -0.3 }}
            />
          </Box>
          <Typography ml={1} fontWeight={600} fontSize={13} variant="body2">
            Opening Times
          </Typography>
        </Box>

        {Object.entries(opening_times).map(([key, value]) => {
          return (
            <Stack
              key={`location-${key}`}
              flexDirection={'row'}
              alignItems={'center'}
              mb={key !== 'sun' ? 1 : 0}
            >
              <Typography width={'50px'} mb={0.5} variant="body2">
                {capitalize(key)}
              </Typography>
              <Typography
                color={value.is_open ? 'success.main' : 'warning.main'}
                sx={{
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  fontSize: 12
                }}
                variant="body2"
              >
                {value.is_open ? `${value.open} - ${value.close}` : 'Closed'}{' '}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </LocationCardStyled>
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

export default React.memo(LocationCard);
