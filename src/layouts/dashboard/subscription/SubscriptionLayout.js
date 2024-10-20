import { Box, Container, Tab, Tabs, Typography } from '@mui/material';
import DashboardTitle from 'components/dashboard-title/DashboardTitle';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import useRestaurantQuery from 'hooks/queries/useRestaurantQuery';
import { DashboardTitleContainer } from 'pages/dashboard/styles';
import React, { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import PricingTable from 'components/pricing';

const iconSx = { marginRight: '6px!important' };

const tabSx = { borderBottom: 1, borderColor: 'divider' };

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

const tabs = { plan: 0, billing: 1, invoices: 2, 'choose-plan': 3 };
const to = { 0: 'plan', 1: 'billing', 2: 'invoices', 3: 'choose-plan' };

const SubscriptionLayout = () => {
  const { data } = useRestaurantQuery();
  const restaurant = data?.data;

  const isSubscribed = !!restaurant?.is_subscribed;

  const location = useLocation();

  const nav = useNavigate();

  const value = useMemo(() => {
    const split = location.pathname.split('/');
    return tabs[split[split.length - 1] || 0];
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    nav(`/dashboard/subscription/${to[newValue]}`);
  };

  return (
    <Container sx={{ px: 3, pb: 4 }} maxWidth={'xl'}>
      <DashboardTitleContainer>
        <DashboardTitle title="Subscription" />

        <Typography mb={4} variant="body2" color={'text.secondary'}>
          You can view and manage {restaurant?.name}'s Deals here.
        </Typography>

        {isSubscribed && (
          <Box sx={tabSx}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab
                icon={<DiamondOutlinedIcon sx={iconSx} fontSize="small" />}
                label="Plan"
                {...a11yProps(0)}
              />
              <Tab
                icon={<CreditCardOutlinedIcon sx={iconSx} fontSize="small" />}
                label="Billing"
                {...a11yProps(1)}
              />
              <Tab
                icon={<ReceiptLongOutlinedIcon sx={iconSx} fontSize="small" />}
                label="Invoices"
                {...a11yProps(1)}
              />
              <Tab
                icon={
                  <AppRegistrationOutlinedIcon sx={iconSx} fontSize="small" />
                }
                label={isSubscribed ? 'Change Plan' : 'Choose Plan'}
                {...a11yProps(1)}
              />
            </Tabs>
          </Box>
        )}
      </DashboardTitleContainer>
      {isSubscribed ? <Outlet /> : <PricingTable />}
    </Container>
  );
};

export default SubscriptionLayout;
