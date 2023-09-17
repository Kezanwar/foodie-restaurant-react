import { useCallback, useEffect, useState } from 'react';

// utils
const on = (obj, ...args) => obj.addEventListener(...args);
const off = (obj, ...args) => obj.removeEventListener(...args);

const useBatteryLow = () => {
  const [isBatteryLow, setIsBatteryLow] = useState(true);
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
    if (navigator?.getBattery) {
      navigator.getBattery().then((bat) => {
        if (mounted) {
          battery = bat;
          onBattery();
        }
      });
    }

    return () => {
      mounted = false;
      if (battery) {
        off(battery, 'levelchange', onChange);
      }
    };
  }, []);
  return isBatteryLow;
};

export default useBatteryLow;
