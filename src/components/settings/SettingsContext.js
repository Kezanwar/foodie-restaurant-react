import PropTypes from 'prop-types';
import {
  createContext,
  useEffect,
  useContext,
  useMemo,
  useCallback
} from 'react';
// hooks
import useLocalStorage from '../../hooks/useLocalStorage';
//
import { defaultSettings } from './config';

// ----------------------------------------------------------------------

const initialState = {
  ...defaultSettings,
  // Mode
  onToggleMode: () => {},
  onChangeMode: () => {}
};

// ----------------------------------------------------------------------

export const SettingsContext = createContext(initialState);

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);

  if (!context)
    throw new Error('useSettingsContext must be use inside SettingsProvider');

  return context;
};

// ----------------------------------------------------------------------

SettingsProvider.propTypes = {
  children: PropTypes.node
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useLocalStorage('settings', defaultSettings);

  // Mode
  const onToggleMode = useCallback(() => {
    const themeMode = settings.themeMode === 'light' ? 'dark' : 'light';
    setSettings({ ...settings, themeMode });
  }, [setSettings, settings]);

  const onChangeMode = useCallback(
    (event) => {
      const themeMode = event.target.value;
      setSettings({ ...settings, themeMode });
    },
    [setSettings, settings]
  );

  const value = useMemo(
    () => ({
      ...settings,
      // Mode
      onToggleMode,
      onChangeMode
    }),
    [
      settings,
      // Mode
      onToggleMode,
      onChangeMode
    ]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
