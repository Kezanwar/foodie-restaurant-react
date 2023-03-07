import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
import NewRestaurantLayout from '../../layouts/new-restaurant/NewRestaurantLayout';
import { NewRestaurantFormStepper } from '../../sections/new-restaurant/NewRestaurantFormStepper';
// components

// ----------------------------------------------------------------------

export default function Overview() {
  return (
    <NewRestaurantLayout>
      <Helmet>
        <title> New Restaurant | Foodie</title>
        <link rel="stylesheet" type="text/css" href="/styles/devices.css" />
      </Helmet>
      <Container maxWidth={'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          New Restaurant
        </Typography>
        <Typography pb={4} gutterBottom>
          Curabitur turpis. Vestibulum facilisis, purus nec pulvinar iaculis,
          ligula mi congue nunc, vitae euismod ligula urna in dolor. Nam quam
          nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Phasellus
          blandit leo ut odio. Vestibulum ante ipsum primis in faucibus orci
          luctus et ultrices posuere cubilia Curae; Fusce id purus.
        </Typography>
        <NewRestaurantFormStepper />
      </Container>
    </NewRestaurantLayout>
  );
}
