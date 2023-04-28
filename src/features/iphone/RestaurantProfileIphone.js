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

const RestaurantProfileIphone = () => {
  const iphoneRef = useRef(null);
  const { isTablet, isMobile } = useCustomMediaQueries();
  const isSmallMobile = useMediaQuery((theme) => theme.breakpoints.down(390));
  const theme = useTheme();

  const { data } = useRestaurantQuery();

  const locationsQuery = useLocationsQuery();

  const locations = locationsQuery?.data?.data || null;

  const [selectedLocationID, setSelectedLocationID] = useState('');

  const selectedLocation = useMemo(() => {
    if (selectedLocationID && locations?.length)
      return locations.find((loc) => loc.id === selectedLocationID);
    return null;
  }, [locations, selectedLocationID]);

  const {
    avatar,
    name,
    bio,
    company_info,

    cover_photo,
    social_media
  } = data?.data || {};

  const { company_address, company_name, company_number } = company_info || {};

  const height = iphoneRef?.current?.height || 1;
  const width = iphoneRef?.current?.width || 1;

  useEffect(() => {
    if (locations?.length) {
      setSelectedLocationID(locations[0].id);
    }
  }, [locations, setSelectedLocationID]);

  return (
    <Stack
      flex={1}
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
          <Box
            sx={{
              width: '100%',
              borderTopRightRadius: '42px',
              borderTopLeftRadius: '42px',
              backgroundSize: 'cover!important',
              height: '275px',
              background: `url(${cover_photo.split('?')[0]})`,
              display: 'flex!important',
              alignItems: 'end',
              padding: 3
            }}
          >
            <img
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50px',
                objectFit: 'cover',
                marginBottom: '24px',
                border: '2px solid white'
              }}
              src={avatar}
              alt={'avatar'}
            />
          </Box>
          <Box
            sx={{
              width: '100%',
              marginTop: '-20px',
              borderTopRightRadius: '12px',
              borderTopLeftRadius: '12px',
              // borderBottomRightRadius: '49px',
              // borderBottomLeftRadius: '49px',
              boxShadow: theme.shadows[4],
              zIndex: '2000',
              // height: '1000px',
              borderBottomLeftRadius: '12px',
              borderBottomRightRadius: '12px',
              position: 'relative',
              padding: 3,
              backgroundColor: theme.palette.background.paper
            }}
          >
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
            <Box
              sx={{
                '& *': {
                  display: 'initial'
                }
              }}
              mb={3}
            >
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
                      <option key={`option-${location.id}`} value={location.id}>
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
                        <React.Fragment key={`iphone-${key}`}>
                          <Stack
                            flexDirection={'row'}
                            alignItems={'center'}
                            mb={key !== 'sun' ? 1 : 0}
                          >
                            <Typography
                              mb={0.25}
                              mr={0.5}
                              width={'40px'}
                              fontSize={12}
                              variant="body2"
                            >
                              {capitalize(key)}
                            </Typography>
                            <Typography
                              color={
                                value.is_open ? 'success.main' : 'warning.main'
                              }
                              sx={{
                                textTransform: 'uppercase',
                                fontWeight: 'medium',
                                mt: '-1.5px',
                                fontSize: 12
                              }}
                              variant="body2"
                            >
                              {value.is_open
                                ? `${value.open} - ${value.close}`
                                : 'Closed'}{' '}
                            </Typography>
                          </Stack>
                        </React.Fragment>
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
                <Typography sx={{ wordBreak: 'break-all' }} fontSize={12}>
                  {selectedLocation?.address?.address_line_1}
                </Typography>
                <Typography sx={{ wordBreak: 'break-all' }} fontSize={12}>
                  {selectedLocation?.address?.address_line_2}
                </Typography>
                <Typography sx={{ wordBreak: 'break-all' }} fontSize={12}>
                  {selectedLocation?.address?.postcode}
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
                <Typography sx={{ wordBreak: 'break-all' }} fontSize={12}>
                  {selectedLocation?.phone_number}
                </Typography>
                <Typography sx={{ wordBreak: 'break-all' }} fontSize={12}>
                  {selectedLocation?.email}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box
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
                  {[
                    '20% Off Lunchtime Menu (Wed - Fri)',
                    '50% Off Drinks Menu (Sat before 5pm)',
                    '2 Courses for £25.00 (Mon - Fri)'
                  ].map((offer, i) => {
                    return (
                      <Box
                        key={offer}
                        sx={{
                          position: 'relative',
                          display: 'flex!important',
                          alignItems: 'center',
                          backgroundColor: theme.palette.background.paper,
                          // boxShadow: theme.shadows[1],
                          justifyContent: 'space-between',
                          border: `1.2px dashed ${theme.palette.primary.lighter}`,
                          borderRadius: '10px',
                          marginBottom: i !== 2 ? 3 : 0,
                          padding: 2,
                          cursor: 'pointer'
                        }}
                      >
                        <Typography variant="subtitle" fontSize={12}>
                          {offer}
                        </Typography>
                        {/* <ArrowForwardIcon
                              className="arrow"
                              sx={{
                                transition: 'all 200ms ease',
                                opacity: 0
                              }}
                              fontSize="22px"
                            /> */}
                        <Box
                          className="voucher-box"
                          sx={{
                            backgroundColor: theme.palette.background.paper,
                            border: 'none',
                            paddingRight: 0.7,
                            paddingBottom: 0,
                            position: 'absolute',
                            left: '2px',
                            top: '2px',
                            color: theme.palette.primary.light,
                            transform:
                              'translateX(-50%) translateY(-50%) scale(0.75) '
                          }}
                        >
                          <SvgColor
                            src={'/assets/icons/navbar/ic_voucher.svg'}
                            sx={{
                              width: 24,
                              height: 24
                            }}
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Iphone14Pro>
    </Stack>
  );
};

RestaurantProfileIphone.propTypes = {};

export default React.memo(RestaurantProfileIphone);
