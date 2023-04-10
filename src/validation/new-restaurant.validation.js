import * as Yup from 'yup';
import { MAX_IMAGE } from '../constants/files.constants';

export const companyInfoSchema = Yup.object().shape({
  company_name: Yup.string().required('Required'),
  company_number: Yup.string().required('Required'),
  company_address: Yup.object({
    address_line_1: Yup.string().required('Required'),
    postcode: Yup.string().required('Required'),
    city: Yup.string().required('Required'),
    country: Yup.string().required('Required')
  })
});

export const restaurantDetailsSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  avatar: Yup.mixed().when(['is_new_avatar'], {
    is: (isNewAvatar) => !!isNewAvatar,
    then: Yup.mixed()
      .required('Profile Image is required!')
      .test(
        'size',
        `Your file is too big, must be ${MAX_IMAGE.text} or less`,
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
    .required('Required')
    .min(140, 'Minimum 140 characters')
    .max(500, 'Maximum 500 characters')
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
        address_line_1: Yup.string().required('Required'),
        postcode: Yup.string().required('Required'),
        city: Yup.string().required('Required'),
        country: Yup.string().required('Required')
      }),
      email: Yup.string()
        .required('Email is required')
        .email('Email must be a valid email address'),
      phone_number: Yup.string().required('Required'),
      nickname: Yup.string().required('Required')
    }),
    otherwise: Yup.object()
  })
});

export const submitApplicationSchema = Yup.object().shape({
  terms_and_conditions: Yup.boolean()
    .required('The terms and conditions must be accepted.')
    .oneOf([true], 'The terms and conditions must be accepted.'),
  privacy_policy: Yup.boolean()
    .required('The privacy policy must be accepted.')
    .oneOf([true], 'The privacy policy must be accepted.')
});
