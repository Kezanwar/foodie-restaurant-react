import * as Yup from 'yup';
import { MAX_IMAGE } from '../constants/files.constants';

export const companyInfoSchema = Yup.object().shape({
  company_name: Yup.string().required('Company name is required'),
  company_number: Yup.string(),
  company_address: Yup.object({
    address_line_1: Yup.string().required('Address line 1 is required'),
    postcode: Yup.string().required('Postcode is required'),
    city: Yup.string().required('City is required'),
    country: Yup.object()
      .test('Country', 'Country is required', (value) => {
        return !!value?.label;
      })
      .nullable()
  })
});

export const restaurantDetailsSchema = Yup.object().shape({
  name: Yup.string().required('Restaurant name is required'),
  avatar: Yup.mixed().when(['is_new_avatar'], {
    is: (isNewAvatar) => !!isNewAvatar,
    then: Yup.mixed()
      .required('Avatar is required!')
      .test(
        'size',
        `Your avatar file is too big, must be ${MAX_IMAGE.text} or less`,
        (value) => value && value.size <= MAX_IMAGE.size
      ),
    otherwise: Yup.mixed()
  }),
  cuisines: Yup.array()
    .min(1, 'Must choose atleast one cuisine')
    .max(4, 'Can only choose up to four cuisines'),
  cover_photo: Yup.mixed().when(['is_new_cover'], {
    is: (isNewCoverPhoto) => !!isNewCoverPhoto,
    then: Yup.mixed()
      .required('Cover Photo is required!')
      .test(
        'size',
        `Your file is too big, must be ${MAX_IMAGE.text} or less`,
        (value) => value && value.size <= MAX_IMAGE.size
      ),
    otherwise: Yup.mixed()
  }),
  bio: Yup.string()
    .required('Restaurant bio is required')
    .min(140, 'Bio is minimum 140 characters')
    .max(500, 'Bio is max 500 characters'),
  booking_link: Yup.string().test({
    test: (str) => {
      if (str.length === 0) return true;
      return !str.includes(' ') && str.includes('.');
    },
    message: 'Booking link must not have any spaces and include a full stop',
    name: 'Booking link'
  })
});

export const addLocationsSchema = Yup.object().shape({
  locations: Yup.array().min(
    1,
    'You need to provide a minimum of one location'
  ),
  add_location: Yup.object().when(['locations', 'is_new_location'], {
    is: (locations, isNewLocation) => locations.length === 0 || isNewLocation,
    then: Yup.object({
      address: Yup.object({
        address_line_1: Yup.string().required('Address line 1 is required'),
        postcode: Yup.string().required('Postcode is required'),
        city: Yup.string().required('City is required'),
        country: Yup.object()
          .test('Country', 'Country is required', (value) => {
            return !!value?.label;
          })
          .nullable()
      }),
      email: Yup.string()
        .required('Email is required')
        .email('Email must be a valid email address'),
      phone_number: Yup.string().required('Phone number is required'),
      nickname: Yup.string().required('Nickname is required')
    }),
    otherwise: Yup.object()
  })
});

export const addLocationsDashboardSchema = Yup.object().shape({
  address: Yup.object({
    address_line_1: Yup.string().required('Address line 1 is required'),
    postcode: Yup.string().required('Postcode is required'),
    city: Yup.string().required('City is required'),
    country: Yup.object()
      .test('Country', 'Country is required', (value) => {
        return !!value?.label;
      })
      .nullable()
  }),
  email: Yup.string()
    .required('Email is required')
    .email('Email must be a valid email address'),
  phone_number: Yup.string().required('Phone number is required'),
  nickname: Yup.string().required('Nickname is required')
});

export const submitApplicationSchema = Yup.object().shape({
  terms_and_conditions: Yup.boolean()
    .required('The terms and conditions must be accepted.')
    .oneOf([true], 'The terms and conditions must be accepted.'),
  privacy_policy: Yup.boolean()
    .required('The privacy policy must be accepted.')
    .oneOf([true], 'The privacy policy must be accepted.')
});
