import { isBefore, startOfDay } from 'date-fns';
import * as Yup from 'yup';

export const newDealSchema = Yup.object().shape({
  name: Yup.string().required('Required').max(30, 'Maximum 30 characters'),
  description: Yup.string()
    .required('Required')
    .min(50, 'Minimum 50 characters')
    .max(300, 'Maximum 300 characters'),
  start_date: Yup.string().required('Required'),
  end_date: Yup.string().test({
    // eslint-disable-next-line object-shorthand, func-names
    test: function (value) {
      if (value === '') {
        return true;
      }

      if (isBefore(startOfDay(new Date(value)), startOfDay(new Date()))) {
        return false;
      }

      const s = this.parent.start_date;

      if (isBefore(startOfDay(new Date(value)), startOfDay(new Date(s)))) {
        return false;
      }

      return true;
    },
    message: 'Start and end date cannot be the same'
  }),
  locations: Yup.array().min(1, 'Minimum 1 required')
});

export const editDealSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  description: Yup.string()
    .required('Required')
    .max(300, 'Maximum 300 characters'),
  end_date: Yup.string().test({
    // eslint-disable-next-line object-shorthand, func-names
    test: function (value) {
      if (value === '') {
        return true;
      }

      console.log(value);

      if (isBefore(startOfDay(new Date(value)), new Date())) {
        return false;
      }

      return true;
    },
    message: 'End date must be in the future'
  }),
  locations: Yup.array().min(1, 'Minimum 1 required')
});
