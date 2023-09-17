import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import {
  Box,
  Container,
  Link,
  ListItemIcon,
  Typography,
  alpha,
  styled
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// components
import LoadingScreen from '../../components/loading-screen/LoadingScreen';
import { DashboardStatGrid } from './styles';
import StatCardDashboard from '../../components/stat-card/StatCardDashboard';
import SvgColor from '../../components/svg-color/SvgColor';
import Subheader from '../../components/subheader/Subheader';
import LightLoadingButton from '../../components/light-loading-button/LightLoadingButton';

// hooks
import useDashboardOverviewQuery from '../../hooks/queries/useDashboardOverviewQuery';
import useRestaurantQuery from '../../hooks/queries/useRestaurantQuery';

// config
import { ICON } from '../../config';
import { PATH_DASHBOARD } from '../../routes/paths';

const icon = (name, color) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1, color: color || 'currentColor' }}
  />
);

export const StyledIcon = styled(ListItemIcon)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: ICON.NAV_ITEM,
  height: ICON.NAV_ITEM,
  marginRight: '0px'
});

export const DealLocationStatCard = styled(Box)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    backgroundColor: alpha(theme.palette.primary.light, 0.01),
    color: isDark ? 'white' : theme.palette.grey[900],
    padding: theme.spacing(2.5),
    borderRadius: theme.spacing(2),
    flex: 1,
    boxShadow: theme.shadows[2]
    // border: `2px solid ${theme.palette.grey[200]}`
  };
});

export const DealLocationWrapper = styled(Box)(({ theme }) => {
  return {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing(3),
    alignItems: 'center',

    marginBottom: theme.spacing(6),
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr'
    }
  };
});

export const DealDataWrapper = styled(Box)(({ theme }) => {
  return {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing(2)
  };
});

export const CardLink = styled(Link)(({ theme }) => {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    fontWeight: 500,
    fontSize: 16,
    cursor: 'pointer',
    textDecoration: 'none!important',
    '&:hover': {
      opacity: 0.8
    }
  };
});

export const DealLocationIconWrapper = styled(Box)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    padding: theme.spacing(0.75),
    backgroundColor: alpha(
      !isDark ? theme.palette.primary.light : '#fff',
      !isDark ? 0.15 : 0
    ),
    borderRadius: '100%',
    aspectRatio: '1/1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };
});

export const Separator = styled(Box)(({ theme }) => ({
  width: '1px',
  height: '200px',
  backgroundColor: theme.palette.grey[300],
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    height: '1px'
  }
}));

// ----------------------------------------------------------------------

export default function Overview() {
  const { data, isLoading, isError } = useDashboardOverviewQuery();
  const rest = useRestaurantQuery();
  const nav = useNavigate();

  const locDealIconCol = 'primary.main';

  const onDealsClick = () => nav(PATH_DASHBOARD.deals);
  const onLocationsClick = () => nav(PATH_DASHBOARD.locations);

  const {
    active_deals,
    booking_clicks,
    expired_deals,
    favourites,
    impressions_views_saves,
    locations
  } = data?.data || {};

  const { impressions, views, saves } = impressions_views_saves?.[0] || {};

  const dataArray = useMemo(() => {
    if (data?.data) {
      return Object.entries({
        views,
        impressions,
        favourites,
        saves,
        booking_clicks
      });
    }
    return [];
  }, [data?.data]);

  const restName = rest?.data?.data.name;

  if (isLoading || rest?.isLoading) return <LoadingScreen />;

  if (isError || rest?.isError) return null;

  return (
    <>
      <Helmet>
        <title> Overview | Foodie</title>
      </Helmet>

      <Container sx={{ px: 3, pb: 6 }} maxWidth={'xl'}>
        <Box mb={4}>
          <Typography variant="h3" component="h1">
            {restName ? `${restName} Dashboard Overview` : 'Dashboard Overview'}
          </Typography>
          <Typography variant="body2" color={'text.secondary'} paragraph>
            Your restaurants current status and insights.
          </Typography>
        </Box>

        <Subheader text={'Your Restaurants current status'} />
        <DealLocationWrapper>
          <DealLocationStatCard>
            <Box
              display={'flex'}
              gap={2}
              alignItems={'center'}
              justifyContent={'space-between'}
              mb={4}
            >
              <Typography color={'primary.light'} variant="h3" component="h2">
                Deals
              </Typography>
              <DealLocationIconWrapper>
                <StyledIcon>{icon('ic_payments', locDealIconCol)}</StyledIcon>
              </DealLocationIconWrapper>
            </Box>

            <DealDataWrapper>
              <Box>
                <Typography
                  color={'text.secondary'}
                  fontWeight={500}
                  component="h4"
                >
                  Active
                </Typography>
                <Typography fontWeight={600} variant="h2" component="h2">
                  {active_deals}
                </Typography>
              </Box>
              <Box>
                <Typography
                  color={'text.secondary'}
                  fontWeight={500}
                  component="h4"
                >
                  Expired
                </Typography>
                <Typography fontWeight={600} variant="h2" component="h2">
                  {expired_deals}
                </Typography>
              </Box>
            </DealDataWrapper>
            <Box mt={4} mb={1}>
              <LightLoadingButton
                onClick={onDealsClick}
                endIcon={<ArrowForwardIcon fontSize="inherit" />}
              >
                View Deals
              </LightLoadingButton>
            </Box>
          </DealLocationStatCard>

          <DealLocationStatCard>
            <Box
              display={'flex'}
              gap={2}
              alignItems={'center'}
              justifyContent={'space-between'}
              mb={4}
            >
              <Typography color={'primary.light'} variant="h3" component="h2">
                Locations
              </Typography>
              <DealLocationIconWrapper>
                <StyledIcon>{icon('ic_locations', locDealIconCol)}</StyledIcon>
              </DealLocationIconWrapper>
            </Box>

            <DealDataWrapper>
              <Box>
                <Typography
                  color={'text.secondary'}
                  fontWeight={500}
                  component="h4"
                >
                  Total
                </Typography>
                <Typography variant="h2" fontWeight={600} component="h2">
                  {locations}
                </Typography>
              </Box>
            </DealDataWrapper>
            <Box mt={4} mb={1}>
              <LightLoadingButton
                onClick={onLocationsClick}
                endIcon={<ArrowForwardIcon fontSize="inherit" />}
              >
                View Locations
              </LightLoadingButton>
            </Box>
          </DealLocationStatCard>
        </DealLocationWrapper>
        <Subheader text={'Your Restaurants Insights'} />
        <DashboardStatGrid>
          {dataArray?.map(([key, value]) => (
            <StatCardDashboard key={key} name={key} value={value} />
          ))}
        </DashboardStatGrid>
      </Container>
    </>
  );
}
