import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Typography, styled } from '@mui/material';
import { useNavigate } from 'react-router';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';

import { DashboardTitleContainer } from '../styles';
import DashboardTitle from '../../../components/dashboard-title/DashboardTitle';
import LoadingScreen from '../../../components/loading-screen/LoadingScreen';
import LightLoadingButton from '../../../components/light-loading-button/LightLoadingButton';

import useRestaurantQuery from '../../../hooks/queries/useRestaurantQuery';
import LocationCard from '../../../components/location-card/LocationCard';
import useLocationsQuery from '../../../hooks/queries/useLocationsQuery';

export const LocationsWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(3),
  marginTop: theme.spacing(6)
}));

const LocationsAll = (props) => {
  const resQuery = useRestaurantQuery();
  const locQuery = useLocationsQuery();

  const locations = locQuery?.data?.data;

  const restaurant = resQuery?.data?.data;

  const restLoading = resQuery?.isLoading;

  if (restLoading) return <LoadingScreen />;
  return (
    <>
      <Helmet>
        <title> Locations | Foodie</title>
      </Helmet>

      <Container sx={{ px: 3, pb: 4 }} maxWidth={'xl'}>
        <DashboardTitleContainer>
          <DashboardTitle title={`${restaurant.name} Locations`} />
          <Typography mb={2} variant="body2" color={'text.secondary'}>
            You can view and manage your locations here.
          </Typography>
          <LightLoadingButton endIcon={<DriveFileRenameOutlineOutlinedIcon />}>
            Add a new location
          </LightLoadingButton>
        </DashboardTitleContainer>
        <LocationsWrapper>
          {locations?.length
            ? locations
                .map((location, index) => {
                  return (
                    <LocationCard
                      {...location}
                      key={location._id}
                      //   onEdit={onEditLocationClick}
                      //   onDelete={onDeleteLocationClick}
                    />
                  );
                })
                .reverse()
            : null}
        </LocationsWrapper>
      </Container>
    </>
  );
};

LocationsAll.propTypes = {};

export default LocationsAll;
