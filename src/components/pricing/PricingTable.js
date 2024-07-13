import React, { useState } from 'react';
import PricingPlanCard from './PricingCard';
import { Stack, styled } from '@mui/material';
import { choosePlan } from 'utils/api';

export const _pricingPlans = [
  {
    subscription: 'individual',
    price: 59,
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
    price: 109,
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
    price: 149,
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
  const [choosePlanError, setChoosePlanError] = useState(false);
  const handleChoosePlan = async (plan) => {
    try {
      await choosePlan(plan);
    } catch (error) {
      setChoosePlanError(error?.message || 'An error occured');
    }
  };

  return (
    <PricingWrapper>
      {_pricingPlans.map((card) => (
        <PricingPlanCard
          key={card.subscription}
          handleChoosePlan={handleChoosePlan}
          card={card}
        />
      ))}
    </PricingWrapper>
  );
};

export default PricingTable;
