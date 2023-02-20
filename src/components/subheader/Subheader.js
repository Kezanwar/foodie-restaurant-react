import React from 'react';
import PropTypes from 'prop-types';
import { StyledSubheader } from './styles';

const Subheader = ({ text, sx }) => <StyledSubheader sx={sx}>{text}</StyledSubheader>;

Subheader.propTypes = {};

export default Subheader;
