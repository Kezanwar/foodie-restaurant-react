import React from 'react';
import { StyledSubheader } from './styles';

const Subheader = ({ text, ...props }) => (
  <StyledSubheader {...props}>{text}</StyledSubheader>
);

Subheader.propTypes = {};

export default Subheader;
