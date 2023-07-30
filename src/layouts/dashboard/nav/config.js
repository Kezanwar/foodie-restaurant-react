// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

const ICONS = {
  user: icon('ic_user'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  credit: icon('ic_credit'),
  menuItem: icon('ic_menu_item'),
  store: icon('ic_store'),
  payments: icon('ic_payments'),
  locations: icon('ic_locations')
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'Restaurant Dashboard',
    items: [
      {
        title: 'Overview',
        path: PATH_DASHBOARD.overview,
        icon: ICONS.analytics
      },
      {
        title: 'Restaurant',
        path: PATH_DASHBOARD.restaurant,
        icon: ICONS.store
      },
      {
        title: 'Locations',
        path: PATH_DASHBOARD.locations,
        icon: ICONS.locations
        // children: [
        //   { title: 'All', path: PATH_DASHBOARD.locations_all },
        //   { title: 'Create', path: PATH_DASHBOARD.locations_create }
        // ]
      },
      {
        title: 'Deals',
        path: PATH_DASHBOARD.deals,
        icon: ICONS.payments
      }
    ]
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'Account Management',
    items: [
      {
        title: 'users',
        path: PATH_DASHBOARD.users,
        icon: ICONS.user
      },
      {
        title: 'subscription',
        path: PATH_DASHBOARD.subscription,
        icon: ICONS.credit
      }
    ]
  }
];
export default navConfig;
