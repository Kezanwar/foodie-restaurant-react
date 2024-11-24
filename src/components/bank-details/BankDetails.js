import React from 'react';
import Card from './Card';
import Link from './Link';
import Revolut from './Revolut';

const BankDetails = ({ billingData }) => {
  const { type } = billingData;

  switch (type) {
    case 'card':
      return <Card billingData={billingData} />;
    case 'link':
      return <Link billingData={billingData} />;
    case 'revolut_pay':
      return <Revolut billingData={billingData} />;
    default:
      return '';
  }
};

export default BankDetails;
