import {
  createContext,
  useEffect,
  useReducer,
  useCallback,
  useState,
  useMemo
} from 'react';

// utils
const on = (obj, ...args) => obj.addEventListener(...args);
const off = (obj, ...args) => obj.removeEventListener(...args);

// ----------------------------------------------------------------------

// const ACTION_TYPES = {
//   SET_BATTERY: 'SET_BATTERY'
// };

// // ----------------------------------------------------------------------

// const initialState = {
//   battery: null,
//   batteryInitialized: false
// };

// const reducer = (state, action) => {
//   if (!action.type) throw new Error('auth reducer action must have a type');
//   switch (action.type) {
//     case ACTION_TYPES.SET_BATTERY:
//       return {
//         batteryInitialized: true,
//         battery: action.payload.battery
//       };

//     default:
//       return state;
//   }
// };

// ----------------------------------------------------------------------

export const UtilityContext = createContext(null);

// ----------------------------------------------------------------------

const UtilityProvider = ({ children }) => {
  const [isBatteryLow, setIsBatteryLow] = useState(false);
  let mounted = true;
  let battery = null;

  const onChange = useCallback(() => {
    const { level } = battery;
    if (level > 0.2) {
      if (isBatteryLow) setIsBatteryLow(false);
    }
    if (level <= 0.2) {
      if (!isBatteryLow) setIsBatteryLow(true);
    }
  }, [battery, isBatteryLow, setIsBatteryLow]);

  const onBattery = () => {
    onChange();
    on(battery, 'levelchange', onChange);
  };

  useEffect(() => {
    navigator.getBattery().then((bat) => {
      if (mounted) {
        battery = bat;
        onBattery();
      }
    });

    return () => {
      mounted = false;
      if (battery) {
        off(battery, 'levelchange', onChange);
      }
    };
  }, []);

  const value = useMemo(() => ({ isBatteryLow }), [isBatteryLow]);

  return (
    <UtilityContext.Provider value={value}>{children}</UtilityContext.Provider>
  );
};

export default UtilityProvider;
