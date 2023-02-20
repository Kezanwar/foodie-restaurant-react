import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const RouterLink = (props) => {
  const {
    children,
    reloadDocument,
    replace,
    state,
    to,
    preventScrollReset,
    relative
  } = props;
  return (
    <Link
      style={{ textDecoration: 'unset', display: 'flex' }}
      reloadDocument={reloadDocument}
      to={to}
      replace={replace}
      state={state}
      preventScrollReset={preventScrollReset}
      relative={relative}
    >
      {children}
    </Link>
  );
};

RouterLink.propTypes = {
  children: PropTypes.element,
  reloadDocument: PropTypes.bool,
  replace: PropTypes.bool,
  state: PropTypes.object,
  preventScrollReset: PropTypes.bool,
  relative: PropTypes.any,
  to: PropTypes.string
};

export default RouterLink;
