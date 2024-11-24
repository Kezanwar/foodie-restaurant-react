import React from 'react';
import { Helmet } from 'react-helmet-async';
import Subheader from 'components/subheader/Subheader';
import BankDetails from 'components/bank-details';

import useBillingQuery from 'hooks/queries/useBillingQuery';

import { DashedWrapper } from './styles';
import LoadingScreen from 'components/loading-screen';

const Billing = () => {
  const billingQuery = useBillingQuery();

  if (billingQuery.isLoading) return <LoadingScreen />;

  return (
    <>
      <Helmet>
        <title> Billing | Foodie</title>
      </Helmet>
      <DashedWrapper>
        <Subheader
          color={'text.secondary'}
          text={'Your Billing Details'}
          mb={2}
        />
        {billingQuery.data.data && (
          <BankDetails billingData={billingQuery.data.data} />
        )}
      </DashedWrapper>
    </>
  );
};

export default Billing;
