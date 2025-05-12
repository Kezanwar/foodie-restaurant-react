import React, { useState } from 'react';
import PricingPlanCard from './PricingCard';
import { Stack, styled } from '@mui/material';
import { choosePlan } from 'lib/api';
import { useSnackbar } from 'notistack';
import { useAuthContext } from 'hooks/useAuthContext';
import Permissions from 'lib/permissions';
import useRestaurantQuery from 'hooks/queries/useRestaurantQuery';
import LoadingScreen from 'components/loading-screen';

export const _pricingPlans = [
  {
    subscription: 'individual',
    price: 66,
    caption:
      'Perfect for start-ups and small restaurants with a single location.',
    lists: [
      { text: 'Single location', isAvailable: true },
      { text: 'Max 3 deals at any time', isAvailable: true },
      { text: 'Partner Dashboard to manage deals', isAvailable: true },
      {
        text: 'Analytics to track deal performance and customer engagement.',
        isAvailable: true
      }
    ]
  },
  {
    subscription: 'premium',
    price: 120,
    caption: 'Suitable for growing businesses with up to 3 locations.',
    lists: [
      { text: 'Up to 3 Locations', isAvailable: true },
      { text: 'Max 15 deals across the locations', isAvailable: true },
      { text: 'Partner Dashboard to manage deals.', isAvailable: true },
      {
        text: 'Analytics to track deal performance and customer engagement.',
        isAvailable: true
      }
    ]
  },
  {
    subscription: 'enterprise',
    price: 'Contact Sales',
    caption: 'Tailored for large enterprises with unlimited locations.',
    lists: [
      { text: 'Unlimited locations', isAvailable: true },
      { text: 'Unlimited deals', isAvailable: true },
      { text: 'Partner Dashboard to manage deals.', isAvailable: true },
      {
        text: 'Analytics to track deal performance and customer engagement.',
        isAvailable: true
      }
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
