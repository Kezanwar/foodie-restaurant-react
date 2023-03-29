import PropTypes from 'prop-types';
import { m } from 'framer-motion';
// @mui
import { Container, Typography } from '@mui/material';
// components
import { MotionContainer, varBounce } from '../components/animate';
// assets
import { ForbiddenIllustration } from '../assets/illustrations';
//
import { useAuthContext } from '../hooks/useAuthContext';
import MotionDivViewport from '../components/animate/MotionDivViewport';

// ----------------------------------------------------------------------

RoleBasedGuard.propTypes = {
  children: PropTypes.node,
  hasContent: PropTypes.bool,
  roles: PropTypes.arrayOf(PropTypes.string)
};

export default function RoleBasedGuard({ hasContent, roles, children }) {
  // Logic here to get current user role
  const { user } = useAuthContext();

  // const currentRole = 'user';
  const currentRole = user?.role; // admin;

  if (typeof roles !== 'undefined' && !roles.includes(currentRole)) {
    return hasContent ? (
      <Container component={MotionContainer} sx={{ textAlign: 'center' }}>
        <MotionDivViewport variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            Permission Denied
          </Typography>
        </MotionDivViewport>

        <MotionDivViewport variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            You do not have permission to access this page
          </Typography>
        </MotionDivViewport>

        <MotionDivViewport variants={varBounce().in}>
          <ForbiddenIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
        </MotionDivViewport>
      </Container>
    ) : null;
  }

  return <>{children}</>;
}
