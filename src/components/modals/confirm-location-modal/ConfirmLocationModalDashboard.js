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
  DialogActions,
  DialogContent,
  Modal,
  Typography,
  useMediaQuery
} from '@mui/material';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

import useRestaurantQuery from '../../../hooks/queries/useRestaurantQuery';

import Spacer from '../../spacer/Spacer';
import CustomMarker from '../../leaflet/CustomMarker';
import {
  MainContent,
  StyledLowerContentContainer,
  StyledMapContainer,
  StyledMapDragMarkerMessage
} from './styles';

const ConfirmLocationModalDashboard = ({
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

  const form = getValues();

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
                  {data?.data?.name} ({form.nickname})
                </Typography>
                <Spacer sp={1} />
                <Typography
                  color={theme.palette.grey[800]}
                  fontSize={12}
                  variant="body2"
                >
                  {form.address.address_line_1}
                </Typography>
                <Typography
                  color={theme.palette.grey[800]}
                  fontSize={12}
                  variant="body2"
                >
                  {form.address.address_line_2}
                </Typography>
                <Typography
                  color={theme.palette.grey[800]}
                  fontSize={12}
                  variant="body2"
                >
                  {form.address.postcode}
                </Typography>
                <Typography
                  color={theme.palette.grey[800]}
                  fontSize={12}
                  variant="body2"
                >
                  {form.address.city}
                </Typography>
                <Typography
                  color={theme.palette.grey[800]}
                  fontSize={12}
                  variant="body2"
                >
                  {form.address.country.label}
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
                  {form.email}
                </Typography>
                <Typography
                  color={theme.palette.grey[800]}
                  fontSize={12}
                  variant="body2"
                >
                  {form.phone_number}
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
            <Button color="inherit" onClick={onCancel} variant="outlined">
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

ConfirmLocationModalDashboard.propTypes = {};

export default React.memo(ConfirmLocationModalDashboard);
