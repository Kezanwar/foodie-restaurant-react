import React from 'react';
import { Helmet } from 'react-helmet-async';

import { useNavigate } from 'react-router';

import useRestaurantQuery from 'hooks/queries/useRestaurantQuery';

import PricingTable from 'components/pricing';

const LocationsAll = () => {
  const resQuery = useRestaurantQuery();

  const nav = useNavigate();

  const restaurant = resQuery?.data?.data || {};

  const isSubscribed = !!restaurant.is_subscribed;

  return (
    <>
      <Helmet>
        <title> Choose Plan | Foodie</title>
      </Helmet>

      <PricingTable />
    </>
  );
};

export default LocationsAll;
