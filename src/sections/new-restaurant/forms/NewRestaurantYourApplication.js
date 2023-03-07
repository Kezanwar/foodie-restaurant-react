import React, { useEffect, useRef, useState } from 'react';
import { m } from 'framer-motion';
import { alpha, Stack } from '@mui/system';
import { capitalize } from 'lodash';
import {
  Alert,
  AlertTitle,
  TextField,
  Typography,
  Box,
  Skeleton,
  CardActionArea,
  CardActions
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import PropTypes from 'prop-types';
import Lottie from 'react-lottie';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { useFormContext, useWatch } from 'react-hook-form';
import { useTheme } from '@emotion/react';

import Iphone14Pro from '../../../components/iphone/Iphone14Pro';
import { varFade } from '../../../components/animate';
import useCustomMediaQueries from '../../../hooks/useCustomMediaQueries';
import LikeLottie from '../../../assets/lottie/like-button.json';

import { pageScrollToTop } from '../../../utils/scroll';
import Subheader from '../../../components/subheader/Subheader';
import Spacer from '../../../components/spacer/Spacer';
import { RHFSelect } from '../../../components/hook-form';
import SvgColor from '../../../components/svg-color/SvgColor';

const defaultOptions = {
  loop: false,
  autoplay: false,

  animationData: LikeLottie,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  },
  style: {
    height: '38px',
    transform: 'scale(3) translateX(2px)'
  }
};

const NewRestaurantYourApplication = (props) => {
  const { isTablet, isMobile } = useCustomMediaQueries();

  const { getValues, watch, setValue } = useFormContext();

  useEffect(() => {
    pageScrollToTop();
  }, []);

  const restaurant = getValues();
  const {
    avatar,
    name,
    bio,
    company_address,
    company_name,
    company_number,
    cover_photo,
    locations,
    social_media
  } = restaurant;

  const iphoneRef = useRef(null);
  const lottieRef = useRef(null);

  const [isPaused, setIsPaused] = useState(true);

  const onClickLottie = () => {
    console.log(lottieRef);
    setIsPaused(false);
  };

  const theme = useTheme();

  const height = iphoneRef?.current?.height || 1;
  const width = iphoneRef?.current?.width || 1;

  if (!restaurant) return null;

  const indexOfLocations = watch('mob_view_location');

  return (
    <m.div variants={varFade().in}>
      <Box
        mb={isMobile ? -4 : 8}
        sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
      >
        <Alert
          sx={{ width: isTablet ? '100%' : '70%' }}
          icon={<HelpIcon />}
          severity={'warning'}
        >
          <AlertTitle>Review your application</AlertTitle>
          Thanks for filling out the application process.
          <Box mt={1}>
            Please review the details about your company and how your restaurant
            will look on our mobile app below before submitting you application.
          </Box>
          <Box mt={2}>
            <strong>Once accepted </strong>
            <Box mt={1}>
              <li>
                Your restaurant profile and locations can be{' '}
                <strong>updated at any time from your dashboard.</strong>
              </li>
              <li>
                You can browse the dashboard and manage your account, but you
                must{' '}
                <strong>
                  {' '}
                  setup your subscription before creating a voucher{' '}
                </strong>
              </li>
            </Box>
          </Box>
        </Alert>
      </Box>
      <Stack flexDirection={'row'} justifyContent={'center'}>
        <Stack
          flex={1}
          sx={
            isMobile
              ? {
                  '& .device': {
                    transform: 'scale(0.8)'
                  }
                }
              : {}
          }
          flexDirection={'row'}
          justifyContent={'center'}
        >
          <Box mr={16} pt={10} width={'max-content'}>
            <Subheader text={'Company Name'} />
            <Spacer sp={1} />
            <Typography
              variant="h6"
              sx={{ wordBreak: 'break-word' }}
              fontSize={20}
            >
              {company_name}
            </Typography>
            <Spacer />

            {company_number && (
              <>
                <Subheader text={'Company Number'} />
                <Spacer sp={1} />
                <Typography
                  variant="h6"
                  sx={{ wordBreak: 'break-word' }}
                  fontSize={18}
                >
                  {company_number}
                </Typography>
                <Spacer />
              </>
            )}

            <Subheader text={'Company Address'} />
            <Spacer sp={1} />
            <Typography
              variant="h6"
              sx={{ wordBreak: 'break-word' }}
              fontSize={18}
            >
              {company_address.address_line_1}
            </Typography>
            <Typography
              variant="h6"
              sx={{ wordBreak: 'break-word' }}
              fontSize={18}
            >
              {company_address.address_line_2 || ''}
            </Typography>
            <Typography
              variant="h6"
              sx={{ wordBreak: 'break-word' }}
              fontSize={18}
            >
              {company_address.postcode || ''}
            </Typography>
          </Box>
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
                  background: `url(${cover_photo?.preview})`,
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
                  src={avatar?.preview}
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
                  <Box
                    component="button"
                    onClick={onClickLottie}
                    type={'button'}
                    sx={{
                      all: 'unset',
                      cursor: 'pointer',
                      display: 'inline!important',
                      transition: 'all 150ms ease',
                      filter:
                        theme.palette.mode === 'light'
                          ? ''
                          : isPaused
                          ? 'invert(1)'
                          : 'invert(0)',
                      '&:hover': {
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    <Lottie
                      options={defaultOptions}
                      ref={lottieRef}
                      height={'40px'}
                      speed={1.4}
                      style={{
                        transform: 'scale(3) translateX(2.5px) translateY(-1px)'
                      }}
                      isStopped={isPaused}
                      isPaused={isPaused}
                      onComplete={() => setIsPaused(true)}
                      isClickToPauseDisabled
                    />
                  </Box>
                </Box>
                <Box mb={3}>
                  <Typography
                    fontSize={14}
                    color={theme.palette.text.secondary}
                  >
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
                <Box sx={{ '& > * ': { display: 'initial' } }} mb={3}>
                  <Spacer sp={1} />
                  <RHFSelect
                    name={'mob_view_location'}
                    label="Location"
                    variant={'filled'}
                  >
                    {locations
                      ? locations?.map((location, index) => {
                          return (
                            <option value={index}>{location.nickname}</option>
                          );
                        })
                      : null}
                  </RHFSelect>
                </Box>

                <Box
                  sx={{
                    display: 'flex!important',
                    gap: 2,
                    justifyContent: 'space-between'
                  }}
                  // mb={3
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
                    {Object.entries(
                      locations[indexOfLocations].opening_times
                    ).map(([key, value]) => {
                      return (
                        <>
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
                                fontWeight: 'semibold',
                                fontSize: 12
                              }}
                              variant="body2"
                            >
                              {value.is_open
                                ? `${value.open} - ${value.close}`
                                : 'Closed'}{' '}
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
                      {locations[indexOfLocations].address_line_1}
                    </Typography>
                    <Typography sx={{ wordBreak: 'break-all' }} fontSize={12}>
                      {locations[indexOfLocations].address_line_2}
                    </Typography>
                    <Typography sx={{ wordBreak: 'break-all' }} fontSize={12}>
                      {locations[indexOfLocations].postcode}
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
                      {locations[indexOfLocations].phone_number}
                    </Typography>
                    <Typography sx={{ wordBreak: 'break-all' }} fontSize={12}>
                      {locations[indexOfLocations].email}
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
                              justifyContent: 'space-between',
                              border: `1.2px dashed ${theme.palette.primary.lighter}`,
                              borderRadius: '10px',
                              marginBottom: i !== 2 ? 3 : 0,
                              padding: 2,
                              cursor: 'pointer',

                              '&:hover': {
                                // border: `1.5px solid ${theme.palette.secondary.main}`,
                                '.arrow': {
                                  opacity: 1
                                }
                                // '.voucher-box': {
                                //   color: theme.palette.success.main
                                // }
                              }
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
      </Stack>
    </m.div>
  );
};

NewRestaurantYourApplication.propTypes = {};

export default React.memo(NewRestaurantYourApplication);

const TikTokIcon = ({ color = '#000000', width = '23px', height = '23px' }) => {
  return (
    <svg
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      width={width}
      height={height}
    >
      <path d="M41,4H9C6.243,4,4,6.243,4,9v32c0,2.757,2.243,5,5,5h32c2.757,0,5-2.243,5-5V9C46,6.243,43.757,4,41,4z M37.006,22.323 c-0.227,0.021-0.457,0.035-0.69,0.035c-2.623,0-4.928-1.349-6.269-3.388c0,5.349,0,11.435,0,11.537c0,4.709-3.818,8.527-8.527,8.527 s-8.527-3.818-8.527-8.527s3.818-8.527,8.527-8.527c0.178,0,0.352,0.016,0.527,0.027v4.202c-0.175-0.021-0.347-0.053-0.527-0.053 c-2.404,0-4.352,1.948-4.352,4.352s1.948,4.352,4.352,4.352s4.527-1.894,4.527-4.298c0-0.095,0.042-19.594,0.042-19.594h4.016 c0.378,3.591,3.277,6.425,6.901,6.685V22.323z" />
    </svg>
  );
};
