import { PATH_NEW_RESTAURANT } from 'routes/paths';

class Permissions {
  // user permissions
  static #USER_ROLES = {
    SUPER_ADMIN: 4,
    ADMIN: 2,
    USER: 1
  };

  static get ROLE_SUPER_ADMIN() {
    return this.#USER_ROLES.SUPER_ADMIN;
  }

  static get ROLE_ADMIN() {
    return this.#USER_ROLES.ADMIN;
  }

  static get ROLE_USER() {
    return this.#USER_ROLES.USER;
  }

  // user crud permissions
  static get EDIT() {
    return this.#USER_ROLES.ADMIN | this.#USER_ROLES.SUPER_ADMIN;
  }

  static hasEditPermission(role) {
    return this.check(this.EDIT, role);
  }

  static isValidUserRole(role) {
    const all_roles =
      this.#USER_ROLES.ADMIN |
      this.#USER_ROLES.SUPER_ADMIN |
      this.#USER_ROLES.USER;
    return this.check(all_roles, role);
  }

  // restaurant statuses
  static #RESTAURANT_STATUSES = {
    NONE: 0,
    APPLICATION_PENDING: 1,
    APPLICATION_PROCESSING: 2,
    APPLICATION_ACCEPTED: 16,
    APPLICATION_REJECTED: 8,
    LIVE: 16,
    DISABLED: 32
  };

  static get STATUS_NONE() {
    return this.#RESTAURANT_STATUSES.NONE;
  }

  static get STATUS_APPLICATION_PENDING() {
    return this.#RESTAURANT_STATUSES.APPLICATION_PENDING;
  }

  static get STATUS_APPLICATION_PROCESSING() {
    return this.#RESTAURANT_STATUSES.APPLICATION_PROCESSING;
  }

  static get STATUS_APPLICATION_ACCEPTED() {
    return this.#RESTAURANT_STATUSES.APPLICATION_ACCEPTED;
  }

  static get STATUS_APPLICATION_REJECTED() {
    return this.#RESTAURANT_STATUSES.APPLICATION_REJECTED;
  }

  static get STATUS_LIVE() {
    return this.#RESTAURANT_STATUSES.LIVE;
  }

  static get STATUS_DISABLED() {
    return this.#RESTAURANT_STATUSES.DISABLED;
  }

  static restaurantStatusIsNone(status) {
    if (!status || status === this.#RESTAURANT_STATUSES.NONE) {
      return true;
    }
    return false;
  }

  static get restaurant_status_pending() {
    return (
      this.#RESTAURANT_STATUSES.APPLICATION_PENDING |
      this.#RESTAURANT_STATUSES.APPLICATION_PROCESSING
    );
  }

  static isApplicationPending(status) {
    if (this.restaurantStatusIsNone(status)) {
      return true;
    }

    return this.check(this.restaurant_status_pending, status);
  }

  static isApplicationRejected(status) {
    return this.check(this.#RESTAURANT_STATUSES.APPLICATION_REJECTED, status);
  }

  static isApplicationProcessing(status) {
    return this.check(this.#RESTAURANT_STATUSES.APPLICATION_PROCESSING, status);
  }

  static isRestaurantLive(status) {
    return this.check(this.#RESTAURANT_STATUSES.LIVE, status);
  }

  static isRestaurantDisabled(status) {
    return this.check(this.#RESTAURANT_STATUSES.DISABLED, status);
  }

  static canViewDashboard(status) {
    const permission =
      this.#RESTAURANT_STATUSES.APPLICATION_ACCEPTED |
      this.#RESTAURANT_STATUSES.LIVE |
      this.#RESTAURANT_STATUSES.DISABLED;
    return this.check(permission, status);
  }

  static #REGISTRATION_STEPS = {
    STEP_1_COMPLETE: 1,
    STEP_2_COMPLETE: 2,
    STEP_3_COMPLETE: 4,
    STEP_4_COMPLETE: 8
  };

  static #regRoutesPermissionMap = {
    [PATH_NEW_RESTAURANT.step_1]:
      this.#REGISTRATION_STEPS.STEP_1_COMPLETE |
      this.#REGISTRATION_STEPS.STEP_2_COMPLETE |
      this.#REGISTRATION_STEPS.STEP_3_COMPLETE |
      this.#REGISTRATION_STEPS.STEP_4_COMPLETE,
    [PATH_NEW_RESTAURANT.step_2]:
      this.#REGISTRATION_STEPS.STEP_1_COMPLETE |
      this.#REGISTRATION_STEPS.STEP_2_COMPLETE |
      this.#REGISTRATION_STEPS.STEP_3_COMPLETE |
      this.#REGISTRATION_STEPS.STEP_4_COMPLETE,
    [PATH_NEW_RESTAURANT.step_3]:
      this.#REGISTRATION_STEPS.STEP_2_COMPLETE |
      this.#REGISTRATION_STEPS.STEP_3_COMPLETE |
      this.#REGISTRATION_STEPS.STEP_4_COMPLETE,
    [PATH_NEW_RESTAURANT.step_4]:
      this.#REGISTRATION_STEPS.STEP_3_COMPLETE |
      this.#REGISTRATION_STEPS.STEP_4_COMPLETE
  };

  static canAccessRoute(route, regStep) {
    return this.check(this.#regRoutesPermissionMap[route], regStep);
  }

  static #redirects = {
    [this.REG_STEP_1_COMPLETE]: PATH_NEW_RESTAURANT.step_2,
    [this.REG_STEP_2_COMPLETE]: PATH_NEW_RESTAURANT.step_3,
    [this.REG_STEP_3_COMPLETE]: PATH_NEW_RESTAURANT.step_4
  };

  static getRegStepRedirect(regStep) {
    return this.#redirects[regStep];
  }

  static get REG_STEP_1_COMPLETE() {
    return this.#REGISTRATION_STEPS.STEP_1_COMPLETE;
  }

  static get REG_STEP_2_COMPLETE() {
    return this.#REGISTRATION_STEPS.STEP_2_COMPLETE;
  }

  static get REG_STEP_3_COMPLETE() {
    return this.#REGISTRATION_STEPS.STEP_3_COMPLETE;
  }

  static get REG_STEP_4_COMPLETE() {
    return this.#REGISTRATION_STEPS.STEP_4_COMPLETE;
  }

  static isStep1Complete(step) {
    return this.check(this.#REGISTRATION_STEPS.STEP_1_COMPLETE, step);
  }

  static isStep2Complete(step) {
    return this.check(this.#REGISTRATION_STEPS.STEP_2_COMPLETE, step);
  }

  static isStep3Complete(step) {
    return this.check(this.#REGISTRATION_STEPS.STEP_3_COMPLETE, step);
  }

  static isStep4Complete(step) {
    return this.check(this.#REGISTRATION_STEPS.STEP_4_COMPLETE, step);
  }

  static #SUBSCRIBES_STATUS = {
    NOT_SUBSCRIBED: 0,
    SUBSCRIBED: 1
  };

  static get SUBSCRIBED() {
    return this.#SUBSCRIBES_STATUS.SUBSCRIBED;
  }

  static get NOT_SUBSCRIBED() {
    return this.#SUBSCRIBES_STATUS.NOT_SUBSCRIBED;
  }

  static isSubscribed(sub) {
    return this.check(this.#SUBSCRIBES_STATUS.SUBSCRIBED, sub);
  }

  static #SUBSCRIPTION_TIER = {
    INDIVIDUAL: 1,
    PREMIUM: 2,
    ENTERPRISE: 4
  };

  static get individual_tier() {
    return this.#SUBSCRIPTION_TIER.INDIVIDUAL;
  }

  static get premium_tier() {
    return this.#SUBSCRIPTION_TIER.PREMIUM;
  }

  static get enterpise_tier() {
    return this.#SUBSCRIPTION_TIER.ENTERPRISE;
  }

  static #TIER_MAP = {
    1: 'individual',
    2: 'premium',
    4: 'enterprise'
  };

  static getTier(tier) {
    return this.#TIER_MAP[tier];
  }

  static isEnterprise(tier) {
    return this.check(this.#SUBSCRIPTION_TIER.ENTERPRISE, tier);
  }

  // generic
  static check(haystack, needle) {
    return !!(haystack & needle);
  }

  static isValidPermission(permission) {
    return typeof permission === 'number';
  }

  static log_dec_to_binary(dec) {
    // debugging tool
    const bin = Number(dec).toString(2);
    const octet = '00000000'.substring(bin.length) + bin;
    console.log(dec, octet);
  }
}

export default Permissions;
