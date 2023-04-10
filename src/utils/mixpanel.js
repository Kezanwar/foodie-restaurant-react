import mixpanel from 'mixpanel-browser';

// Enabling the debug mode flag is useful during implementation,
// but it's recommended you remove it for production

export const MIXPANEL_EVENTS = {
  home_guest_page_rendered: 'home_guest_page_rendered',
  about_us_guest_page_rendered: 'about_us_guest_page_rendered',
  pricing_guest_page_rendered: 'pricing_guest_page_rendered',
  register_guest_page_rendered: 'register_guest_page_rendered',
  login_guest_page_rendered: 'login_guest_page_rendered',
  register_success: 'register_success',
  register_failed: 'register_failed',
  login_success: 'login_success',
  login_failed: 'login_failed',
  logout_success: 'logout_success'
};

export async function mixpanelTrack(eventName, props) {
  const _props = props ?? {};
  const _eventName = eventName ?? '';
  try {
    mixpanel.track(_eventName, _props);
  } catch (error) {
    console.log(error);
  }
}
export async function mixpanelIdentifyUser(userID) {
  // console.log(eventName, props);
  try {
    mixpanel.identify(userID);
  } catch (error) {
    console.log(error);
  }
}

// export async function mixpanelSetUserProperties(userInfo) {
//   // console.log(eventName, props);
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
