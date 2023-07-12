import axiosInstance from './axios';
import { formattedDateString } from './formatTime';

const endpoints = {
  getRestaurant: '/restaurant',

  // create new restaurant
  postCompanyInfo: '/create-restaurant/company-info',
  postRestaurantDetails: '/create-restaurant/details',
  postLocationsStep: '/create-restaurant/locations',
  postSubmitApplication: 'create-restaurant/submit-application',

  // locations
  getLocations: '/locations',
  checkLocation: '/locations/check',
  checkEditLocation: '/locations/edit/check',
  addLocation: '/locations/add',
  editLocation: '/locations/edit',
  deleteLocation: '/locations/delete',

  // deals
  getActiveDeals: '/deals/active',
  getExpiredDeals: '/deals/expired',
  getSingleDeal: '/deals/single',
  addDeal: '/deals/add',

  // options
  getOptions: '/options'
};

//* ------ Restaurant --------

export const getRestaurant = () => {
  return axiosInstance.get(endpoints.getRestaurant);
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
  return axiosInstance.get(endpoints.getActiveDeals, {
    params: {
      current_date: formattedDateString(new Date())
    }
  });
};

export const getExpiredDeals = async () => {
  return axiosInstance.get(endpoints.getExpiredDeals, {
    params: {
      current_date: formattedDateString(new Date())
    }
  });
};

export const getSingleDeal = async (id) => {
  return axiosInstance.get(`${endpoints.getSingleDeal}/${id}`);
};

export const addDeal = (data) => {
  return axiosInstance.post(endpoints.addDeal, data);
};

//* ------------------ Options -------------------

export const getOptions = () => {
  return axiosInstance.get(endpoints.getOptions);
};
