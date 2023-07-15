// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  login: '/login',
  register: '/register'
};

// ----------------------------------------------------------------------

const ROOTS_DASHBOARD = '/dashboard';

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  overview: path(ROOTS_DASHBOARD, '/overview'),
  deals: path(ROOTS_DASHBOARD, '/deals'),
  deals_all: path(ROOTS_DASHBOARD, '/deals/all'),
  deals_create: path(ROOTS_DASHBOARD, '/deals/create'),
  deals_single: path(ROOTS_DASHBOARD, '/deals/single'),
  restaurant: path(ROOTS_DASHBOARD, '/restaurant'),
  users: path(ROOTS_DASHBOARD, '/users'),
  subscription: path(ROOTS_DASHBOARD, '/subscription')

  // user: {
  //   root: path(ROOTS_DASHBOARD, '/user'),
  //   four: path(ROOTS_DASHBOARD, '/user/four'),
  //   five: path(ROOTS_DASHBOARD, '/user/five'),
  //   six: path(ROOTS_DASHBOARD, '/user/six'),
  // },
};

// ----------------------------------------------------------------------

const ROOT_NEW_REST = '/new-restaurant';

export const PATH_NEW_RESTAURANT = {
  new_restaurant: ROOT_NEW_REST,
  step_1: path(ROOT_NEW_REST, '/step-1'),
  step_2: path(ROOT_NEW_REST, '/step-2'),
  step_3: path(ROOT_NEW_REST, '/step-3'),
  step_4: path(ROOT_NEW_REST, '/step-4')
};

// -----------------------------------------------------------------------

export const PATH_MISC = {
  four0four: '/404',
  confirm_email: '/confirm-email'
};
