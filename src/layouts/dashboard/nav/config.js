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
  payments: icon('ic_payments')
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
        title: 'Deals',
        path: PATH_DASHBOARD.deals,
        icon: ICONS.payments,
        children: [
          { title: 'All', path: PATH_DASHBOARD.deals_all },
          { title: 'Create', path: PATH_DASHBOARD.deals_create }
          // { title: 'Five', path: PATH_DASHBOARD.user.five },
          // { title: 'Six', path: PATH_DASHBOARD.user.six }
        ]
      },

      {
        title: 'Restaurant',
        path: PATH_DASHBOARD.restaurant,
        icon: ICONS.store
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
        // children: [
        //   { title: 'Four', path: PATH_DASHBOARD.user.four },
        //   { title: 'Five', path: PATH_DASHBOARD.user.five },
        //   { title: 'Six', path: PATH_DASHBOARD.user.six },
        // ],
      },
      {
        title: 'subscription',
        path: PATH_DASHBOARD.subscription,
        icon: ICONS.credit
        // children: [
        //   { title: 'Four', path: PATH_DASHBOARD.user.four },
        //   { title: 'Five', path: PATH_DASHBOARD.user.five },
        //   { title: 'Six', path: PATH_DASHBOARD.user.six },
        // ],
      }
    ]
  }
];
export default navConfig;
