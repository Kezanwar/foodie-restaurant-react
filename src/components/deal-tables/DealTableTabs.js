import React from 'react';
import PropTypes from 'prop-types';
import AlarmOnOutlinedIcon from '@mui/icons-material/AlarmOnOutlined';
import AlarmOffOutlinedIcon from '@mui/icons-material/AlarmOffOutlined';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ActiveDealTable from './ActiveDealTable';
import ExpiredDealTable from './ExpiredDealTable';

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
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
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

export default function DealTableTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            icon={
              <AlarmOnOutlinedIcon
                sx={{ marginRight: '6px!important' }}
                fontSize="small"
              />
            }
            label="Active"
            {...a11yProps(0)}
          />
          <Tab
            icon={
              <AlarmOffOutlinedIcon
                sx={{ marginRight: '6px!important' }}
                fontSize="small"
              />
            }
            label="Expired"
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <ActiveDealTable />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ExpiredDealTable />
      </TabPanel>
    </Box>
  );
}
