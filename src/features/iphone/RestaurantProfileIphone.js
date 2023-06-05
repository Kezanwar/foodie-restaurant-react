import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Stack,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';
import { capitalize } from 'lodash';
import { useTheme } from '@emotion/react';

import Iphone14Pro from '../../components/iphone/Iphone14Pro';
import SvgColor from '../../components/svg-color/SvgColor';
import useLocationsQuery from '../../hooks/queries/useLocationsQuery';
import useRestaurantQuery from '../../hooks/queries/useRestaurantQuery';
import Spacer from '../../components/spacer/Spacer';
import useCustomMediaQueries from '../../hooks/useCustomMediaQueries';
import {
  CoverPhotoContainer,
  MainSection,
  DealContainer,
  DealIconBox,
  DealsSection
} from './styles';

const EXAMPLE_DEALS = [
  '20% Off Lunchtime Menu (Wed - Fri)',
  '50% Off Drinks Menu (Sat before 5pm)',
  '2 Courses for £25.00 (Mon - Fri)'
];

const AvatarStyles = {
  width: '100px',
  height: '100px',
  borderRadius: '50px',
  objectFit: 'cover',
  marginBottom: '24px',
  border: '2px solid white'
};

const TypographyWordBreak = { wordBreak: 'break-all' };

const OpeningTimeText = ({ day, value }) => {
  return (
    <Stack
      flexDirection={'row'}
      alignItems={'center'}
      mb={day !== 'sun' ? 1 : 0}
    >
      <Typography
        mb={0.25}
        mr={0.5}
        width={'40px'}
        fontSize={12}
        variant="body2"
      >
        {capitalize(day)}
      </Typography>
      <Typography
        color={value.is_open ? 'success.main' : 'warning.main'}
        sx={{
          textTransform: 'uppercase',
          fontWeight: 'medium',
          mt: '-1.5px',
          fontSize: 12
        }}
        variant="body2"
      >
        {value.is_open ? `${value.open} - ${value.close}` : 'Closed'}{' '}
      </Typography>
    </Stack>
  );
};

const RestaurantProfileIphone = () => {
  const iphoneRef = useRef(null);
  const { isMobile } = useCustomMediaQueries();
  const isSmallMobile = useMediaQuery((theme) => theme.breakpoints.down(390));
  const theme = useTheme();

  const { data } = useRestaurantQuery();

  const locationsQuery = useLocationsQuery();

  const locations = locationsQuery?.data?.data || null;

  const [selectedLocationID, setSelectedLocationID] = useState('');

  const selectedLocation = useMemo(() => {
    if (selectedLocationID && locations?.length)
      return locations.find((loc) => loc._id === selectedLocationID);
    return null;
  }, [locations, selectedLocationID]);

  const { avatar, name, bio, cover_photo } = data?.data || {};

  const height = iphoneRef?.current?.height || 1;
  const width = iphoneRef?.current?.width || 1;

  useEffect(() => {
    if (locations?.length) {
      setSelectedLocationID(locations[0]._id);
    }
  }, [locations, setSelectedLocationID]);

  return (
    <Stack
      flex={1}
      maxWidth={'100vw'}
      overflow={'hidden'}
      sx={
        isMobile
          ? {
              '& .device': {
                transform: isSmallMobile ? 'scale(0.7)' : 'scale(0.75)'
              },
              marginTop: -4,
              marginBottom: -4
            }
          : {
              '& .device': {
                transform: 'scale(0.8)',
                marginTop: -10
              }
            }
      }
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Iphone14Pro ref={iphoneRef}>
        <Box
          sx={{
            height: height - 40,
            paddingBottom: 0,
            backgroundColor: theme.palette.background.paper,
            width: width - 38,
            overflowY: 'scroll',
            borderRadius: '49px',
            '&::-webkit-scrollbar': {
              width: 0,
              borderRadius: 5
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
              width: 0
            },
            '&::-webkit-scrollbar-thumb': {
              width: 0
            }
          }}
        >
          <CoverPhotoContainer url={`url(${cover_photo})`}>
            <img style={AvatarStyles} src={avatar} alt={'avatar'} />
          </CoverPhotoContainer>
          <MainSection>
            <Box
              sx={{
                display: 'flex!important',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              mb={1.5}
            >
              <Typography ml={0} variant="h6">
                {name}
              </Typography>
            </Box>
            <Box mb={3}>
              <Typography fontSize={14} color={theme.palette.text.secondary}>
                {bio}
              </Typography>
              {/* <Box sx={{ display: 'flex!important' }}>
                  <FacebookIcon color="blue" />
                  <InstagramIcon color="purple" />
                  <TikTokIcon />
                  <LinkedInIcon color={'blue'} />
                </Box> */}
            </Box>

            <Box
              sx={{
                width: '100%',
                height: '1.2px',
                boxShadow: theme.shadows[19],
                background: `-webkit-linear-gradient(45deg, ${theme.palette.primary.main} 10%, ${theme.palette.primary.lighter} 90%)`
              }}
              mb={3}
            />
            <Box mb={3}>
              <Spacer sp={1} />
              {locations ? (
                <TextField
                  label="Location"
                  select
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  SelectProps={{
                    native: true
                  }}
                  variant={'filled'}
                  value={selectedLocationID}
                  onChange={(e) => {
                    setSelectedLocationID(e.target.value);
                  }}
                >
                  {locations?.map((location) => {
                    return (
                      <option
                        key={`option-${location._id}`}
                        value={location._id}
                      >
                        {location.nickname}
                      </option>
                    );
                  })}
                </TextField>
              ) : null}
            </Box>

            <Box
              sx={{
                display: 'flex!important',
                gap: 2,
                justifyContent: 'space-between'
              }}
            >
              <Box flex={1}>
                <SvgColor
                  src={`/assets/icons/navbar/ic_time.svg`}
                  sx={{
                    width: 24,
                    height: 24,
                    color: theme.palette.primary.main
                  }}
                />
                <Spacer sp={1} />

                {selectedLocation &&
                  Object.entries(selectedLocation?.opening_times).map(
                    ([key, value]) => {
                      return (
                        <OpeningTimeText
                          key={`iphone-${key}`}
                          day={key}
                          value={value}
                        />
                      );
                    }
                  )}
              </Box>
              <Box flex={1}>
                <SvgColor
                  src={`/assets/icons/navbar/ic_store.svg`}
                  sx={{
                    width: 24,
                    height: 24,
                    color: theme.palette.primary.main
                  }}
                />
                <Spacer sp={1.1} />
                <Typography sx={TypographyWordBreak} fontSize={12}>
                  {selectedLocation?.address?.address_line_1}
                </Typography>
                <Typography sx={TypographyWordBreak} fontSize={12}>
                  {selectedLocation?.address?.address_line_2}
                </Typography>
                <Typography sx={TypographyWordBreak} fontSize={12}>
                  {selectedLocation?.address?.postcode}
                </Typography>
                <Typography sx={TypographyWordBreak} fontSize={12}>
                  {selectedLocation?.address?.city}
                </Typography>
                <Typography sx={TypographyWordBreak} fontSize={12}>
                  {selectedLocation?.address?.country}
                </Typography>
                <Spacer sp={3} />
                <SvgColor
                  src={`/assets/icons/navbar/ic_chat.svg`}
                  sx={{
                    width: 24,
                    height: 24,
                    color: theme.palette.primary.main
                  }}
                />
                <Spacer sp={1.25} />
                <Typography sx={TypographyWordBreak} fontSize={12}>
                  {selectedLocation?.phone_number}
                </Typography>
                <Typography sx={TypographyWordBreak} fontSize={12}>
                  {selectedLocation?.email}
                </Typography>
              </Box>
            </Box>
          </MainSection>
          <DealsSection
            sx={{
              padding: 3,
              backgroundColor: theme.palette.background.paper
            }}
          >
            <Box mb={1.5}>
              <Box sx={{ display: 'flex!important', alignItems: 'center' }}>
                <Typography ml={0} variant="h6">
                  Deals
                </Typography>
                <Typography
                  ml={1}
                  color={'text.secondary'}
                  fontSize={'16px!important'}
                  variant="body1"
                >
                  (Examples)
                </Typography>
              </Box>
              <Box>
                <Spacer sp={3} />
                <Box>
                  {EXAMPLE_DEALS.map((offer, i) => {
                    return (
                      <DealContainer key={offer}>
                        <Typography variant="subtitle" fontSize={12}>
                          {offer}
                        </Typography>
                        <DealIconBox className="deal-box">
                          <SvgColor
                            src={'/assets/icons/navbar/ic_deal.svg'}
                            sx={{
                              width: 24,
                              height: 24
                            }}
                          />
                        </DealIconBox>
                      </DealContainer>
                    );
                  })}
                </Box>
              </Box>
            </Box>
          </DealsSection>
        </Box>
      </Iphone14Pro>
    </Stack>
  );
};

RestaurantProfileIphone.propTypes = {};

export default React.memo(RestaurantProfileIphone);
