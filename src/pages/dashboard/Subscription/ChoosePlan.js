import React from 'react';
import { Helmet } from 'react-helmet-async';
import useRestaurantQuery from 'hooks/queries/useRestaurantQuery';
import PricingTable from 'components/pricing';

const ChoosePlan = () => {
  const resQuery = useRestaurantQuery();

  const restaurant = resQuery.data?.restaurant || {};

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
