import * as Yup from 'yup';

export const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email must be a valid email address')
    .required('Email is required'),
  password: Yup.string().required('Password is required')
});

export const RegisterSchema = Yup.object().shape({
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  email: Yup.string()
    .required('Email is required')
    .email('Email must be a valid email address'),
  password: Yup.string()
    .matches(/[@$!%*#?&]+/, 'Must have special character')
    .matches(/\d+/, 'Must have one number')
    .matches(/[a-z]+/, 'Must have one lowercase character')
    .matches(/[A-Z]+/, 'Must have uppercase character'),
  confirm_password: Yup.string()
    .required('Must retype your password')
    .oneOf([Yup.ref('password')], 'Passwords must match')
});
