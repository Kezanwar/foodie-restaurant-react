import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Box, Stack } from '@mui/system';
import { capitalize } from 'lodash';
import {
  FormControlLabel,
  Checkbox,
  TextField,
  Typography
} from '@mui/material';

import useCustomMediaQueries from '../../hooks/useCustomMediaQueries';

import { CanDisableInputContainer } from '../../sections/forms/styles';
import { OPENING_TIMES_OPTIONS } from '../../constants/utils.constants';

const OpeningTimeInput = ({
  field,
  name,
  onCheck,
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
            label={capitalize(name.split('.')[1])}
            control={
              <Checkbox
                onClick={onCheck}
                label={capitalize(name)}
                checked={!!field?.value?.is_open}
              />
            }
          />
        </Box>

        <Typography
          color={field?.value?.is_open ? 'success.main' : 'warning.main'}
          sx={{
            marginLeft: 'auto',
            fontSize: 12,
            textTransform: 'uppercase',
            width: '50px',
            fontWeight: 'bold'
          }}
        >
          {field?.value?.is_open ? 'Open' : 'Closed'}
        </Typography>
      </Stack>
      <Stack
        flexDirection={'row'}
        width={isMobile ? '100%' : ''}
        gap={isTablet ? 2 : 3}
        flex={1}
      >
        <CanDisableInputContainer disabled={!field?.value?.is_open} flex={1}>
          <TextField
            select
            fullWidth
            SelectProps={{ native: true }}
            variant={'filled'}
            label="Open"
            defaultValue={'09:00am'}
            onChange={onOpenChange}
            value={field?.value?.open}
          >
            {field?.value?.is_open ? (
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
        <CanDisableInputContainer disabled={!field?.value?.is_open} flex={1}>
          <TextField
            select
            fullWidth
            SelectProps={{ native: true }}
            variant={'filled'}
            label="Close"
            defaultValue={'11:00pm'}
            onChange={onCloseChange}
            value={field?.value?.close}
          >
            {field?.value?.is_open ? (
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
