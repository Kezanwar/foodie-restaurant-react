// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  login: '/login',
  register: '/register',
};

// ----------------------------------------------------------------------

const ROOTS_DASHBOARD = '/dashboard';

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  overview: path(ROOTS_DASHBOARD, '/overview'),
  vouchers: path(ROOTS_DASHBOARD, '/vouchers'),
  restaurant: path(ROOTS_DASHBOARD, '/restaurant'),
  users: path(ROOTS_DASHBOARD, '/users'),
  subscription: path(ROOTS_DASHBOARD, '/subscription'),

  // user: {
  //   root: path(ROOTS_DASHBOARD, '/user'),
  //   four: path(ROOTS_DASHBOARD, '/user/four'),
  //   five: path(ROOTS_DASHBOARD, '/user/five'),
  //   six: path(ROOTS_DASHBOARD, '/user/six'),
  // },
};

// ----------------------------------------------------------------------

export const PATH_NEW_RESTAURANT = {
  new_restaurant: '/new-restaurant',
};
