import { startOfDay } from 'date-fns';
import axiosInstance from './axios';

const endpoints = {
  getDashboardOverview: '/rest/dashboard/overview',
  getRestaurant: '/rest/restaurant',
  editRestaurant: 'rest/restaurant/edit',

  // create new restaurant
  postCompanyInfo: '/rest/create-restaurant/company-info',
  postRestaurantDetails: '/rest/create-restaurant/details',
  postLocationsStep: '/rest/create-restaurant/locations',
  postSubmitApplication: '/rest/create-restaurant/submit-application',

  // locations
  getLocations: '/rest/locations',
  checkLocation: '/rest/locations/check',
  checkEditLocation: '/rest/locations/edit/check',
  addLocation: '/rest/locations/add',
  editLocation: '/rest/locations/edit',
  deleteLocation: '/rest/locations/delete',

  // deals
  getActiveDeals: '/rest/deals/active',
  getExpiredDeals: '/rest/deals/expired',
  getSingleDeal: '/rest/deals/single',

  addDeal: '/rest/deals/add',
  editDeal: 'rest/deals/edit',
  expireDeal: '/rest/deals/expire',
  deleteDeal: '/rest/deals/delete',
  templateDeal: '/rest/deals/use-template',

  // options
  getOptions: '/options',

  // account management
  forgotPassword: '/auth/forgot-password',
  changePassword: '/auth/change-password',

  // subsrciptions

  getSubscription: '/rest/subscriptions/manage',
  getBilling: '/rest/subscriptions/manage/billing',
  getInvoices: '/rest/subscriptions/manage/invoices',
  choosePlan: '/rest/subscriptions/new/choose-plan'
};

//* ------ Overview --------

export const getDashboardOverview = () => {
  return axiosInstance.get(endpoints.getDashboardOverview);
};
//* ------ Restaurant --------

export const getRestaurant = () => {
  return axiosInstance.get(endpoints.getRestaurant);
};

export const editRestaurant = (data) => {
  return axiosInstance.patch(endpoints.editRestaurant, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

//* ------ Create new restaurant journey --------

// step1
export const postCompanyInfo = (data) => {
  return axiosInstance.post(endpoints.postCompanyInfo, data);
};
// step2
export const postRestaurantDetails = (data) => {
  return axiosInstance.post(endpoints.postRestaurantDetails, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
// step3
export const postLocationsStep = () => {
  return axiosInstance.post(endpoints.postLocationsStep);
};

// step4
export const postSubmitApplicationStep = (data) => {
  return axiosInstance.post(endpoints.postSubmitApplication, data);
};

//* ----------------- Locations -----------------

export const getLocations = async () => {
  return axiosInstance.get(endpoints.getLocations);
};

export const checkLocation = (data) => {
  return axiosInstance.post(endpoints.checkLocation, data);
};

export const checkEditLocation = (data, id) => {
  return axiosInstance.post(`${endpoints.checkEditLocation}/${id}`, data);
};

export const addLocation = (data) => {
  return axiosInstance.post(endpoints.addLocation, data);
};

export const editLocation = (data, id) => {
  return axiosInstance.patch(`${endpoints.editLocation}/${id}`, data);
};

export const deleteLocation = (id) => {
  return axiosInstance.post(`${endpoints.deleteLocation}/${id}`);
};

//* ----------------- Deals -----------------

export const getActiveDeals = async () => {
  return axiosInstance.get(endpoints.getActiveDeals);
};

export const getExpiredDeals = async () => {
  return axiosInstance.get(endpoints.getExpiredDeals);
};

export const getSingleDeal = async (id) => {
  return axiosInstance.get(`${endpoints.getSingleDeal}/${id}`);
};

export const addDeal = (data) => {
  return axiosInstance.post(endpoints.addDeal, data);
};

export const editDeal = (id, data) => {
  return axiosInstance.patch(`${endpoints.editDeal}/${id}`, data);
};

export const expireDeal = (id) => {
  return axiosInstance.patch(`${endpoints.expireDeal}/${id}`, {
    end_date: startOfDay(new Date()).toISOString()
  });
};

export const deleteDeal = (id) => {
  return axiosInstance.post(`${endpoints.deleteDeal}/${id}`);
};

export const getDealTemplate = (id) => {
  return axiosInstance.get(`${endpoints.templateDeal}/${id}`);
};

//* ------------------ Options -------------------

export const getOptions = () => {
  return axiosInstance.get(endpoints.getOptions);
};

// * ---------------- Account Management -------------------

export const forgotPassword = (email) => {
  return axiosInstance.post(endpoints.forgotPassword, {
    email
  });
};

export const changePassword = (token, password) => {
  return axiosInstance.patch(`${endpoints.changePassword}/${token}`, {
    password
  });
};

// * ---------------- Subscription  -------------------

export const choosePlan = (plan) => {
  return axiosInstance.post(`${endpoints.choosePlan}`, {
    plan
  });
};

export const getSubscription = () => {
  return axiosInstance.get(endpoints.getSubscription);
};

export const getBilling = () => {
  return axiosInstance.get(endpoints.getBilling);
};

export const getInvoices = () => {
  return axiosInstance.get(endpoints.getInvoices);
};
