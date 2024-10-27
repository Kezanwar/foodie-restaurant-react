import { Helmet } from 'react-helmet-async';
// @mui
import { Typography } from '@mui/material';
// components
import { MotionContainer } from 'components/animate';

export default function MaintenanceMode() {
  return (
    <>
      <Helmet>
        <title> Maintenance | Foodie</title>
      </Helmet>

      <MotionContainer>
        <Typography mb={4} variant="h3" paragraph>
          Maintenance Alert
        </Typography>

        <Typography mb={2} variant="body2">
          Hello! 👋
          <br />
          <br />
          Our web application is currently down for scheduled maintenance to
          improve your experience. We're working hard to make things even better
          for you and expect to be back online shortly.
        </Typography>
        <Typography mb={2} variant="body2">
          Thank you for your patience and understanding! If you have any
          questions or need assistance, feel free to reach out to us at{' '}
          <a href="mailto:admin@thefoodie.app">admin@thefoodie.app</a>
        </Typography>
        <Typography mb={2} variant="body2">
          See you soon! 😊 — The Foodie Team
        </Typography>
      </MotionContainer>
    </>
  );
}
