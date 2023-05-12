import React, { forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

const Iphone14Pro = forwardRef(({ children }, ref) => {
  useImperativeHandle(
    ref,
    () => ({
      height: 868,
      width: 428
    }),
    []
  );

  return (
    <div ref={ref} className="device device-iphone-14-pro">
      <div className="device-frame">{children}</div>
      <div className="device-header" />
      <div className="device-sensors" />
      <div className="device-btns" />
      <div className="device-power" />
      <div className="device-home" />
    </div>
  );
});

Iphone14Pro.propTypes = {
  children: PropTypes.element
};

export default Iphone14Pro;
