import * as Yup from 'yup';

export const newVoucherSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  start_date: Yup.string().required('Required'),
  end_date: Yup.string().required('Required'),
  timezone: Yup.string().required('Required'),
  locations: Yup.array().min(1, 'Minimum 1 required')
});
