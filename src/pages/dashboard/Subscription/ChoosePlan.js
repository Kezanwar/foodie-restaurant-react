import React from 'react';
import { Helmet } from 'react-helmet-async';

import { useNavigate } from 'react-router';

import useRestaurantQuery from 'hooks/queries/useRestaurantQuery';

import PricingTable from 'components/pricing';
import useSubscriptionQuery from 'hooks/queries/useSubscriptionQuery';

const ChoosePlan = () => {
  const resQuery = useRestaurantQuery();

  const nav = useNavigate();

  const restaurant = resQuery?.data?.data || {};

  const isSubscribed = !!restaurant.is_subscribed;

  return (
    <>
      <Helmet>
        <title> Choose Plan | Foodie</title>
      </Helmet>

      <PricingTable currentTier={restaurant.tier} />
    </>
  );
};

export default ChoosePlan;
