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
    .matches(/[@$!%*#?&]+/, 'Password must have special character')
    .matches(/\d+/, 'Password must have one number')
    .matches(/[a-z]+/, 'Password must have one lowercase character')
    .matches(/[A-Z]+/, 'Password must have uppercase character'),
  confirm_password: Yup.string()
    .required('Must confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match')
});

export const ChangePasswordSchema = Yup.object().shape({
  password: Yup.string()
    .matches(/[@$!%*#?&]+/, 'Password must have special character')
    .matches(/\d+/, 'Password must have one number')
    .matches(/[a-z]+/, 'Password must have one lowercase character')
    .matches(/[A-Z]+/, 'Password must have uppercase character'),
  confirm_password: Yup.string()
    .required('Must confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match')
});

export const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Email must be a valid email address')
});
