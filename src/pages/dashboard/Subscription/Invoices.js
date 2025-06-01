import React from 'react';

import { Helmet } from 'react-helmet-async';
import useInvoicesQuery from 'hooks/queries/useInvoicesQuery';
import { DashedWrapper, PlanLoading } from './styles';
import InvoicesTable from 'components/invoices/InvoiceTable';
import Subheader from 'components/subheader/Subheader';
import { Navigate } from 'react-router';

const Invoices = () => {
  const { data, isLoading, isError } = useInvoicesQuery();

  if (isError) {
    return <Navigate to={'/dashboard/overview'} />;
  }

  return (
    <>
      <Helmet>
        <title> Invoices | Foodie</title>
      </Helmet>
      {isLoading ? (
        <PlanLoading />
      ) : (
        <DashedWrapper>
          <Subheader color={'text.secondary'} text={'Your Invoices'} mb={2} />

          <InvoicesTable invoices={data.data} />
        </DashedWrapper>
      )}
    </>
  );
};

export default Invoices;
