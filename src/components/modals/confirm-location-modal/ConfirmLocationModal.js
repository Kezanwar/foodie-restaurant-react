import React, { useCallback, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTheme } from '@emotion/react';
import { LoadingButton } from '@mui/lab';
import { alpha, Stack } from '@mui/system';
import { capitalize } from 'lodash';
import {
  Box,
  Button,
  Dialog,
  Typography,
  useMediaQuery,
  styled,
  DialogContent,
  DialogActions
} from '@mui/material';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import useRestaurantQuery from 'hooks/queries/useRestaurantQuery';

import Spacer from 'components/spacer/Spacer';
import CustomMarker from 'components/leaflet/CustomMarker';

const MainContent = styled(Box)(({ theme }) => ({
  background: theme.palette.common.white,
  width: '480px',
  maxWidth: '95vw',
  borderRadius: 1
}));

const StyledMapContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  '& .leaflet-container': {
    height: 400,
    margin: '0 auto',
    width: '100%',
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.down(420)]: {
      height: 200
    }
  }
}));

const StyledMapDragMarkerMessage = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '12px',
  zIndex: '5000',
  right: '12px',
  padding: '10px 14px',
  borderRadius: '8px',
  backgroundColor: alpha(theme.palette.common.white, 0.3),
  boxShadow: theme.shadows[12],
  backdropFilter: 'blur(4px)'
}));

const StyledLowerContentContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  position: 'relative'
}));

const ConfirmLocationModal = ({
  isOpen,
  mapPosition,
  onCancel,
  onSubmit,
  submitLoading,
  openingTimes
}) => {
  const mapRef = useRef();
  const markerRef = useRef();

  const theme = useTheme();

  const { data } = useRestaurantQuery();

  const { getValues } = useFormContext();

  const { add_location } = getValues();

  const isSmallMob = useMediaQuery((theme) => theme.breakpoints.down(420));

  const onConfirmClick = useCallback(() => {
    const latlng = markerRef?.current._latlng;
    const { lat, lng: long } = latlng;
    onSubmit({ lat, long });
  }, [onSubmit]);

  return (
    <Dialog open={isOpen}>
      <MainContent>
        <StyledMapContainer id={'map'}>
          <StyledMapDragMarkerMessage>
            <Typography fontWeight={500} fontSize={10} color={'black'}>
              Drag the marker to adjust (if needed)
            </Typography>
          </StyledMapDragMarkerMessage>
          <MapContainer
            ref={mapRef}
            center={mapPosition}
            zoom={16}
            scrollWheelZoom
          >
            <TileLayer url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png" />
            {/* <TileLayer
              url={`${'https://{s}.tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token='}${
                process.env.JAWG_API_KEY
              }`}
            /> */}
            <Marker
              ref={markerRef}
              icon={new CustomMarker()}
              draggable
              position={mapPosition}
            >
              <Popup>Drag me to fine tune location</Popup>
            </Marker>
          </MapContainer>
          <DialogContent>
            <StyledLowerContentContainer>
              <Box flex={1} mr={3}>
                <Typography
                  color={'black'}
                  fontWeight={600}
                  fontSize={isSmallMob ? 12 : 16}
                  variant="body2"
                >
                  {data?.data?.name} ({add_location.nickname})
                </Typography>
                <Spacer sp={1} />
                <Typography
                  color={theme.palette.grey[800]}
                  fontSize={12}
                  variant="body2"
                >
                  {add_location.address.address_line_1}
                </Typography>
                <Typography
                  color={theme.palette.grey[800]}
                  fontSize={12}
                  variant="body2"
                >
                  {add_location.address.address_line_2}
                </Typography>
                <Typography
                  color={theme.palette.grey[800]}
                  fontSize={12}
                  variant="body2"
                >
                  {add_location.address.postcode}
                </Typography>
                <Typography
                  color={theme.palette.grey[800]}
                  fontSize={12}
                  variant="body2"
                >
                  {add_location.address.city}
                </Typography>
                <Typography
                  color={theme.palette.grey[800]}
                  fontSize={12}
                  variant="body2"
                >
                  {add_location.address.country.label}
                </Typography>
                <Spacer sp={3} />
                <Typography
                  color={'black'}
                  fontWeight={600}
                  fontSize={isSmallMob ? 12 : 16}
                  variant="body2"
                >
                  Contact Details
                </Typography>
                <Spacer sp={1} />
                <Typography
                  color={theme.palette.grey[800]}
                  fontSize={12}
                  variant="body2"
                >
                  {add_location.email}
                </Typography>
                <Typography
                  color={theme.palette.grey[800]}
                  fontSize={12}
                  variant="body2"
                >
                  {add_location.phone_number}
                </Typography>
              </Box>
              <Box flex={1}>
                <Typography
                  color={'black'}
                  fontWeight={600}
                  fontSize={isSmallMob ? 12 : 16}
                  variant="body2"
                >
                  Opening Times
                </Typography>
                <Spacer sp={1} />
                {Object.entries(openingTimes).map(([key, value]) => {
                  return (
                    <Stack
                      key={`modal${key}`}
                      flexDirection={'row'}
                      alignItems={'center'}
                      mb={key !== 'sun' ? 1 : 0}
                    >
                      <Typography
                        width={isSmallMob ? '40px' : '60px'}
                        color={theme.palette.grey[800]}
                        fontSize={12}
                        variant="body2"
                      >
                        {capitalize(key)}
                      </Typography>
                      <Typography
                        color={value.is_open ? 'success.main' : 'warning.main'}
                        sx={{
                          textTransform: 'uppercase',
                          fontWeight: '600',
                          fontSize: isSmallMob ? 9 : 12
                        }}
                        variant="body2"
                      >
                        {value.is_open
                          ? `${value.open} - ${value.close}`
                          : 'Closed'}
                      </Typography>
                    </Stack>
                  );
                })}
              </Box>
            </StyledLowerContentContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={onCancel} color="inherit" variant="outlined">
              Cancel
            </Button>
            <LoadingButton
              loading={submitLoading}
              color="primary"
              onClick={onConfirmClick}
              variant="contained"
            >
              Confirm
            </LoadingButton>
          </DialogActions>
        </StyledMapContainer>
      </MainContent>
    </Dialog>
  );
};

ConfirmLocationModal.propTypes = {};

export default React.memo(ConfirmLocationModal);
