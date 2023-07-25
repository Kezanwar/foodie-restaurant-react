import mixpanel from 'mixpanel-browser';

// Enabling the debug mode flag is useful during implementation,
// but it's recommended you remove it for production

export const MIXPANEL_EVENTS = {
  // -------- AUTH

  // register
  register_success: 'fe_register_success',
  register_failed: 'fe_register_failed',
  register_form_errors: 'fe_register_form_errors',
  // login
  login_success: 'fe_login_success',
  login_form_errors: 'fe_login_form_errors',
  login_failed: 'fe_login_failed',
  logout_success: 'fe_logout_success',

  // -------- CREATE RESTAURANT
  // Company info
  create_restaurant_company_info_success:
    'fe_create_restaurant_company_info_success',
  create_restaurant_company_info_failed:
    'fe_create_restaurant_company_info_failed',
  create_restaurant_company_info_errors:
    'fe_create_restaurant_company_info_errors',

  // Restaurant profile
  create_restaurant_rest_profile_success:
    'fe_create_restaurant_rest_profile_success',
  create_restaurant_rest_profile_failed:
    'fe_create_restaurant_rest_profile_failed',
  create_restaurant_rest_profile_errors:
    'fe_create_restaurant_rest_profile_errors',

  // Add locations
  create_restaurant_add_locations_success:
    'fe_create_restaurant_add_locations_success',
  create_restaurant_add_locations_failed:
    'fe_create_restaurant_add_locations_failed',
  create_restaurant_add_locations_errors:
    'fe_create_restaurant_add_locations_errors',

  // Submit application
  create_restaurant_submit_application_success:
    'fe_create_restaurant_submit_application_success',
  create_restaurant_submit_application_failed:
    'fe_create_restaurant_submit_application_failed',
  create_restaurant_submit_application_errors:
    'fe_create_restaurant_submit_application_errors',

  // ------- LOCATIONS
  check_location_success: 'fe_check_location_success',
  check_location_failed: 'fe_check_location_failed',
  add_location_success: 'fe_add_location_success',
  add_location_failed: 'fe_add_location_failed',
  edit_location_success: 'fe_edit_location_success',
  edit_location_failed: 'fe_edit_location_failed',
  delete_location_success: 'fe_delete_location_success',
  delete_location_failed: 'fe_delete_location_failed',

  // ---- DEALS
  add_deal_success: 'fe_add_deal_sucess',
  add_deal_error: 'fe_add_deal_error',
  edit_deal_success: 'fe_edit_deal_sucess',
  edit_deal_error: 'fe_edit_deal_error',
  delete_deal_success: 'fe_delete_deal_success',
  delete_deal_error: 'fe_delete_deal_error',
  expire_deal_success: 'fe_expire_deal_success',
  expire_deal_error: 'fe_expire_deal_error',
  use_template_deal: 'fe_use_template_deal'
};

export function mixpanelTrack(eventName, props) {
  const _props = props ?? {};
  const _eventName = eventName ?? '';
  try {
    mixpanel.track(_eventName, _props);
  } catch (error) {
    console.error(error);
  }
}
export function mixpanelIdentifyUser(userID) {
  // console.error(eventName, props);
  try {
    mixpanel.identify(userID);
  } catch (error) {
    console.error(error);
  }
}

// export async function mixpanelSetUserProperties(userInfo) {
//   console.log(eventName, props);
//   const { first_name, last_name } = userInfo;
//   try {
//     mixpanel.people.set({
//       Type: type,
//       $email: email,
//       Income: income,
//       EmploymentStatus: employment_status,
//       MonthlyRentMortgage: monthly_rent_mortgage,
//       RelationshipStatus: relationship_status,
//       Dependents: dependents,
//       $name: first_name + ' ' + last_name,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }
