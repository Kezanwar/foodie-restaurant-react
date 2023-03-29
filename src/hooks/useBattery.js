import { useEffect, useState } from 'react';

// utils
const on = (obj, ...args) => obj.addEventListener(...args);
const off = (obj, ...args) => obj.removeEventListener(...args);

export default function useBattery() {
  const [state, setState] = useState({});
  let mounted = true;
  let battery = null;

  const onChange = () => {
    const { charging, level, chargingTime, dischargingTime } = battery;
    setState({
      charging,
      level,
      chargingTime,
      dischargingTime
    });
  };

  const onBattery = () => {
    onChange();
    on(battery, 'chargingchange', onChange);
    on(battery, 'levelchange', onChange);
    on(battery, 'chargingtimechange', onChange);
    on(battery, 'dischargingtimechange', onChange);
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
        off(battery, 'chargingchange', onChange);
        off(battery, 'levelchange', onChange);
        off(battery, 'chargingtimechange', onChange);
        off(battery, 'dischargingtimechange', onChange);
      }
    };
  }, [0]);

  return state;
}
