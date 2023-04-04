import axiosInstance from './axios';

const endpoints = {
  getRestaurant: '/restaurant',
  getLocations: '/locations/all',

  // create new restaurant
  postCompanyInfo: '/create-restaurant/company-info',
  postRestaurantDetails: 'create-restaurant/details',

  // locations
  checkLocation: '/locations/check',
  checkEditLocation: '/locations/edit/check',
  addLocation: '/locations/add',
  editLocation: '/locations/edit',
  deleteLocation: '/locations/delete',

  // options

  getOptions: '/options'
};

export const getRestaurant = async () => {
  const res = await axiosInstance.get(endpoints.getRestaurant);
  return res;
};

export const getLocations = async () => {
  const res = await axiosInstance.get(endpoints.getLocations);
  return res;
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

//* ----------------- Locations -----------------

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

//* ------------------ Options -------------------

export const getOptions = () => {
  return axiosInstance.get(endpoints.getOptions);
};
