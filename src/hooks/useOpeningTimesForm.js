import { useReducer } from 'react';

const initialState = {
  mon: { is_open: true, open: '10:00 AM', close: '11:00 PM' },
  tue: { is_open: true, open: '10:00 AM', close: '11:00 PM' },
  wed: { is_open: true, open: '10:00 AM', close: '11:00 PM' },
  thu: { is_open: true, open: '10:00 AM', close: '11:00 PM' },
  fri: { is_open: true, open: '10:00 AM', close: '11:00 PM' },
  sat: { is_open: true, open: '10:00 AM', close: '11:00 PM' },
  sun: { is_open: true, open: '10:00 AM', close: '11:00 PM' }
};

const reducer = (state, action) => {
  if (!action.type)
    throw new Error('opening times form reducer action must have a type');
  switch (action.type) {
    case 'UPDATE':
      return {
        ...state,
        [action.payload.day]: {
          ...state[action.payload.day],
          [action.payload.key]: action.payload.value
        }
      };
    case 'REPLACE':
      return action.payload;
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

const useOpeningTimesForm = () => {
  const [openingTimes, dispatch] = useReducer(reducer, initialState);
  const updateOpeningTimes = (day, key, value) => {
    dispatch({
      type: 'UPDATE',
      payload: { day, key, value }
    });
  };

  const resetOpeningTimes = () =>
    dispatch({
      type: 'RESET'
    });

  const replaceOpeningTimes = (newForm) =>
    dispatch({
      type: 'REPLACE',
      payload: newForm
    });

  return {
    openingTimes,
    updateOpeningTimes,
    resetOpeningTimes,
    replaceOpeningTimes
  };
};

useOpeningTimesForm.propTypes = {};

export default useOpeningTimesForm;
