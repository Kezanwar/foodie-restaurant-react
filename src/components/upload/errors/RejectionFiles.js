import PropTypes from 'prop-types';
import { Error } from '@mui/icons-material';
// @mui
import { alpha } from '@mui/material/styles';
import { Alert, AlertTitle, Box, Paper, Typography } from '@mui/material';
import { fileData } from '../../file-thumbnail';
import { fData } from '../../../utils/formatNumber';
import { MAX_IMAGE } from '../../../constants/files.constants';

// utils

// ----------------------------------------------------------------------

RejectionFiles.propTypes = {
  fileRejections: PropTypes.array
};

export default function RejectionFiles({ fileRejections }) {
  if (!fileRejections.length) {
    return null;
  }

  return (
    <Box
      pt={1}
      // variant="outlined"
      width={'max-content'}
      sx={
        {
          // py: 1,
          // px: 2,
          // marginTop: 6
          // bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
          // borderColor: (theme) => alpha(theme.palette.error.main, 0.24)
        }
      }
    >
      {fileRejections.map(({ file, errors }) => {
        const { path, size } = fileData(file);

        return (
          <Alert key={path} severity={'error'} sx={{ my: 1 }}>
            <AlertTitle variant="subtitle2" noWrap>
              {path} - {size ? fData(size) : ''}
            </AlertTitle>

            {errors.map((error) => (
              <Box
                key={error.code}
                component="li"
                sx={{ typography: 'body2', fontSize: '14px' }}
              >
                {error.message.replace(
                  `${MAX_IMAGE.size} bytes`,
                  `${MAX_IMAGE.text}, please reduce the size of this image or choose another.`
                )}
              </Box>
            ))}
          </Alert>
        );
      })}
    </Box>
  );
}
