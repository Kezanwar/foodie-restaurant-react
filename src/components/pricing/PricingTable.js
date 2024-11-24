import React, { useState } from 'react';
import PricingPlanCard from './PricingCard';
import { Stack, styled } from '@mui/material';
import { choosePlan } from 'utils/api';
import { useSnackbar } from 'notistack';
import { useAuthContext } from 'hooks/useAuthContext';
import Permissions from 'utils/permissions';
import useRestaurantQuery from 'hooks/queries/useRestaurantQuery';
import LoadingScreen from 'components/loading-screen';

export const _pricingPlans = [
  {
    subscription: 'individual',
    price: 55,
    caption:
      'The perfect package for individual Restaurants with a single location',
    lists: [
      { text: '3 prototypes', isAvailable: true },
      { text: '3 boards', isAvailable: true },
      { text: 'Up to 5 team members', isAvailable: false },
      { text: 'Advanced security', isAvailable: false },
      { text: 'Permissions & workflows', isAvailable: false }
    ]
  },
  {
    subscription: 'premium',
    price: 100,
    caption: 'Ideal package for a medium sized business with 2-5 locations',
    lists: [
      { text: '3 prototypes', isAvailable: true },
      { text: '3 boards', isAvailable: true },
      { text: 'Up to 5 team members', isAvailable: true },
      { text: 'Advanced security', isAvailable: false },
      { text: 'Permissions & workflows', isAvailable: false }
    ]
  },
  {
    subscription: 'enterprise',
    price: 'Contact Sales',
    caption: 'Ideal package for multi-chain Restaurants with 6+ locations',
    lists: [
      { text: '3 prototypes', isAvailable: true },
      { text: '3 boards', isAvailable: true },
      { text: 'Up to 5 team members', isAvailable: true },
      { text: 'Advanced security', isAvailable: true },
      { text: 'Permissions & workflows', isAvailable: true }
    ]
  }
];

const PricingWrapper = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  gap: 16,
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column'
  }
}));

const PricingTable = () => {
  const [choosePlanLoading, setChoosePlanLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const resQuery = useRestaurantQuery();

  const restaurant = resQuery?.data?.data || {};

  const TIER = Permissions.getTier(restaurant.tier);

  const handleChoosePlan = async (plan) => {
    try {
      setChoosePlanLoading(plan);
      const res = await choosePlan(plan);

      if (plan === 'enterprise') {
        enqueueSnackbar(
          `Our Sales team have been notified! They will respond to you via email to ${user.email}.`
        );
        return;
      }

      const link = res.data.checkout_url;
      window.location.href = link;
    } catch (error) {
      enqueueSnackbar(error?.message || 'Sorry, an unexpected error occured.', {
        variant: 'error'
      });
    } finally {
      setChoosePlanLoading(false);
    }
  };

  if (resQuery.isLoading) return <LoadingScreen />;

  return (
    <PricingWrapper>
      {_pricingPlans.map((card) => (
        <PricingPlanCard
          key={card.subscription}
          handleChoosePlan={handleChoosePlan}
          card={card}
          currentTier={TIER}
          isLoading={
            choosePlanLoading && card.subscription === choosePlanLoading
          }
        />
      ))}
    </PricingWrapper>
  );
};

export default PricingTable;
