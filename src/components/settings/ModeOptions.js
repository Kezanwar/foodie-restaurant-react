// @mui
import { RadioGroup } from '@mui/material';
//
import SvgColor from '../svg-color';
import { useSettingsContext } from './SettingsContext';
import {
  StyledCard,
  StyledWrap,
  MaskControl,
  StyledCardHeader,
  StyledWrapHeader
} from './styles';

// ----------------------------------------------------------------------

const OPTIONS = ['light', 'dark'];

export default function ModeOptions() {
  const { themeMode, onChangeMode } = useSettingsContext();

  return (
    <RadioGroup name="themeMode" value={themeMode} onChange={onChangeMode}>
      <StyledWrapHeader>
        {OPTIONS.map((mode) => (
          <StyledCardHeader key={mode} selected={themeMode === mode}>
            <SvgColor
              src={`/assets/icons/setting/${
                mode === 'light' ? 'ic_sun' : 'ic_moon'
              }.svg`}
            />

            <MaskControl value={mode} />
          </StyledCardHeader>
        ))}
      </StyledWrapHeader>
    </RadioGroup>
  );
}
