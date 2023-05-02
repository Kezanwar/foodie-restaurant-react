import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/system';
import { IconButton, Stack, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '@emotion/react';
import { capitalize } from 'lodash';

import { LocationCardStyled } from './styles';

import SvgColor from '../svg-color/SvgColor';
import useCustomMediaQueries from '../../hooks/useCustomMediaQueries';
import { varFade } from '../animate';
import useRestaurantQuery from '../../hooks/queries/useRestaurantQuery';
import Subheader from '../subheader/Subheader';

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
  const { isMobile } = useCustomMediaQueries();
  const { data } = useRestaurantQuery();

  return (
    <LocationCardStyled layout>
      <Box
        sx={{
          position: 'absolute',
          top: theme.spacing(2),
          right: theme.spacing(1.5),
          display: 'flex'
        }}
      >
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
      </Box>

      <Stack
        sx={{
          gap: 0.25
        }}
        mb={2}
      >
        <Box mb={2} display={'flex'} alignItems={'center'}>
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

          <Typography ml={1} fontWeight={600} fontSize={13} variant="body2">
            {data?.data?.name} ({nickname})
          </Typography>
        </Box>

        <Typography variant="body2">{address_line_1}</Typography>
        <Typography variant="body2">{address_line_2}</Typography>
        <Typography variant="body2">{postcode}</Typography>
        <Typography variant="body2">{city}</Typography>
        <Typography variant="body2">{country}</Typography>
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

        <Typography variant="body2">{email}</Typography>
        <Typography variant="body2">{phone_number}</Typography>
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
            <>
              <Stack
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
              {/* {key !== 'sun' && !isMobile ? (
                <Box
                  mb={1}
                  sx={{
                    width: '100%',
                    height: '0.5px',
                    backgroundColor: theme.palette.divider
                  }}
                />
              ) : (
                ''
              )} */}
            </>
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
