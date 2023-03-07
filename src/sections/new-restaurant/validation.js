import * as Yup from 'yup';
import { MAX_IMAGE } from '../../constants/files.constants';

export const NewRestaurantSchema = Yup.object().shape({
  // company info
  company_name: Yup.string().when('activeStep', {
    is: 0,
    then: Yup.string().required('Required'),
    otherwise: Yup.string()
  }),
  company_address: Yup.object().when('activeStep', {
    is: 0,
    then: Yup.object({
      address_line_1: Yup.string().required('Required'),
      postcode: Yup.string().required('Required'),
      city: Yup.string().required('Required'),
      country: Yup.string().required('Required')
    }),
    otherwise: Yup.object()
  }),

  name: Yup.string().when('activeStep', {
    is: 1,
    then: Yup.string().required('Required'),
    otherwise: Yup.string()
  }),
  //   store_url: Yup.string().when('activeStep', {
  //     is: 1,
  //     then: Yup.string().test(
  //       'store url test',
  //       'Required, must only container letters, hyphens or spaces (which will automatically convert to hyphens)',
  //       (value) => regexAlphaSpaceHyphen.test(value)
  //     ),
  //     otherwise: Yup.string()
  //   }),
  avatar: Yup.mixed().when(['activeStep', 'is_new_avatar'], {
    is: (activeStep, isNewAvatar) => activeStep === 1 && isNewAvatar,
    then: Yup.mixed()
      .required('Profile Image is required!')
      .test(
        'size',
        `Your file is too big, must be ${MAX_IMAGE.text} or less`,
        (value) => value && value.size <= MAX_IMAGE.size
      ),
    otherwise: Yup.mixed()
  }),
  cover_photo: Yup.mixed().when(['activeStep', 'is_new_cover'], {
    is: (activeStep, isNewCoverPhoto) => activeStep === 1 && isNewCoverPhoto,
    then: Yup.mixed()
      .required('Cover Photo is required!')
      .test(
        'size',
        `Your file is too big, must be ${MAX_IMAGE.text} or less`,
        (value) => value && value.size <= MAX_IMAGE.size
      ),
    otherwise: Yup.mixed()
  }),
  bio: Yup.string().when('activeStep', {
    is: 1,
    then: Yup.string()
      .min(140, 'Minimum 140 characters')
      .max(500, 'Maximum 500 characters'),
    otherwise: Yup.string()
  }),
  locations: Yup.array().when('activeStep', {
    is: 2,
    then: Yup.array().min(1, 'You need to provide a minimum of one location'),
    otherwise: Yup.array()
  }),
  add_location: Yup.object().when(
    ['activeStep', 'locations', 'is_new_location'],
    {
      is: (activeStep, locations, isNewLocation) =>
        (activeStep === 2 && locations.length === 0) ||
        (activeStep === 2 && isNewLocation),
      then: Yup.object({
        address_line_1: Yup.string().required('Required'),
        postcode: Yup.string().required('Required'),
        city: Yup.string().required('Required'),
        country: Yup.string().required('Required'),
        email: Yup.string()
          .required('Email is required')
          .email('Email must be a valid email address'),
        phone_number: Yup.string().required('Required'),
        nickname: Yup.string().required('Required')
      }),
      otherwise: Yup.object()
    }
  )
  //   store_address_use_company: Yup.bool().when('activeStep', {
  //     is: 1,
  //     then: Yup.bool().required('Required'),
  //     otherwise: Yup.bool()
  //   }),
  //   store_address: Yup.object().when(
  //     ['activeStep', 'store_address_use_company'],
  //     {
  //       is: (activeStep, store_address_use_company) =>
  //         activeStep === 1 && !store_address_use_company,
  //       then: Yup.object({
  //         address_line_1: Yup.string().required('Required'),
  //         postcode: Yup.string().required('Required'),
  //         city: Yup.string().required('Required'),
  //         country: Yup.string().required('Required')
  //       }),
  //       otherwise: Yup.object()
  //     }
  //   ),
  //   email: Yup.string().when('activeStep', {
  //     is: 1,
  //     then: Yup.string().required('Required'),
  //     otherwise: Yup.string()
  //   }),
  //   contact_number: Yup.string().when('activeStep', {
  //     is: 1,
  //     then: Yup.string().required('Required'),
  //     otherwise: Yup.string()
  //   })
});
