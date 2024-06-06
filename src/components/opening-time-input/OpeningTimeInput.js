import React, { Fragment } from 'react';

import { Box, Stack } from '@mui/system';
import {
  FormControlLabel,
  Checkbox,
  TextField,
  Typography
} from '@mui/material';

import useCustomMediaQueries from 'hooks/useCustomMediaQueries';

import { CanDisableInputContainer } from 'components/hook-form/styles';
import { OPENING_TIMES_OPTIONS } from './options';

const OpeningTimeInput = ({
  value,
  name,
  setIsOpen,
  onCloseChange,
  onOpenChange
}) => {
  const { isMobile, isTablet } = useCustomMediaQueries();
  return (
    <Stack
      flexDirection={isMobile ? 'column' : 'row'}
      alignItems={isMobile ? 'start' : 'center'}
      gap={isTablet ? 2 : 3}
      mb={4}
    >
      <Stack
        flexDirection={'row'}
        alignItems={'baseline'}
        mb={isMobile ? 2 : 0}
      >
        <Box sx={{ width: '80px' }}>
          <FormControlLabel
            label={name}
            control={
              <Checkbox
                onClick={setIsOpen}
                label={name}
                checked={!!value?.is_open}
              />
            }
          />
        </Box>

        <Typography
          color={value?.is_open ? 'success.main' : 'warning.main'}
          sx={{
            marginLeft: 'auto',
            fontSize: 12,
            textTransform: 'uppercase',
            width: '50px',
            fontWeight: 'bold'
          }}
        >
          {value?.is_open ? 'Open' : 'Closed'}
        </Typography>
      </Stack>
      <Stack
        flexDirection={'row'}
        width={isMobile ? '100%' : ''}
        gap={isTablet ? 2 : 3}
        flex={1}
      >
        <CanDisableInputContainer disabled={!value?.is_open} flex={1}>
          <TextField
            select
            fullWidth
            InputLabelProps={{ shrink: true }}
            SelectProps={{ native: true }}
            variant={'filled'}
            label="Open"
            defaultValue={'09:00am'}
            onChange={(e) => {
              onOpenChange(e.target.value);
            }}
            value={value?.open}
          >
            {value?.is_open ? (
              <>
                {OPENING_TIMES_OPTIONS.map((otoption) => {
                  return (
                    <option key={`open-${otoption}`} value={otoption}>
                      {otoption}
                    </option>
                  );
                })}
              </>
            ) : (
              <option>--</option>
            )}
          </TextField>
        </CanDisableInputContainer>
        <CanDisableInputContainer disabled={!value?.is_open} flex={1}>
          <TextField
            select
            fullWidth
            InputLabelProps={{ shrink: true }}
            SelectProps={{ native: true }}
            variant={'filled'}
            label="Close"
            defaultValue={'11:00pm'}
            onChange={(e) => onCloseChange(e.target.value)}
            value={value?.close}
          >
            {value?.is_open ? (
              <>
                {OPENING_TIMES_OPTIONS.map((otoption) => {
                  return (
                    <option key={`close-${otoption}`} value={otoption}>
                      {otoption}
                    </option>
                  );
                })}
              </>
            ) : (
              <option>--</option>
            )}
          </TextField>
        </CanDisableInputContainer>
      </Stack>
    </Stack>
  );
};

OpeningTimeInput.propTypes = {};

export default React.memo(OpeningTimeInput);
