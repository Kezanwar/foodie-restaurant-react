import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ActiveDealTable from './ActiveDealTable';
import ExpiredDealTable from './ExpiredDealTable';
import { useLocation, useNavigate } from 'react-router';

import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

import DashboardStickyBar from 'components/dashboard-sticky-bar';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box py={3}>{children}</Box>}
    </Box>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

const tabs = { live: 0, expired: 1 };
const to = { 0: 'live', 1: 'expired' };

export default function DealTableTabs() {
  const location = useLocation();

  const nav = useNavigate();

  const value = useMemo(() => {
    const split = location.pathname.split('/');
    return tabs[split[split.length - 1]];
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    nav(`/dashboard/deals/${to[newValue]}`);
  };

  return (
    <Box key={'deals-tabs-header'} sx={{ width: '100%' }}>
      <DashboardStickyBar>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            icon={
              <CheckCircleOutlineOutlinedIcon
                color="success"
                sx={{ marginRight: '6px!important' }}
                fontSize="small"
              />
            }
            label="Live"
            {...a11yProps(0)}
          />
          <Tab
            icon={
              <CancelOutlinedIcon
                color="error"
                sx={{ marginRight: '6px!important' }}
                fontSize="small"
              />
            }
            label="Expired"
            {...a11yProps(1)}
          />
        </Tabs>
      </DashboardStickyBar>
      <TabPanel value={value} index={0}>
        <ActiveDealTable />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ExpiredDealTable />
      </TabPanel>
    </Box>
  );
}
