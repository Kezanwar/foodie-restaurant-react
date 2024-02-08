import React from 'react';
import PropTypes from 'prop-types';
import { ExpandableContentContainer, ExpandableWrapper } from './styles';

const ExpandableBox = ({ children, expanded }) => {
  return (
    <ExpandableWrapper expanded={expanded}>
      <ExpandableContentContainer>{children}</ExpandableContentContainer>
    </ExpandableWrapper>
  );
};

ExpandableBox.propTypes = {
  children: PropTypes.node,
  expanded: PropTypes.bool
};

export default ExpandableBox;
