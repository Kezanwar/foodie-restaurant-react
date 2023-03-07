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
    <div
      style={{ zIndex: '20001' }}
      ref={ref}
      className="device device-iphone-14-pro"
    >
      <div style={{ zIndex: '20001' }} className="device-frame">
        {children}
      </div>
      <div style={{ zIndex: '20001' }} className="device-header" />
      <div style={{ zIndex: '20001' }} className="device-sensors" />
      <div style={{ zIndex: '20001' }} className="device-btns" />
      <div style={{ zIndex: '20001' }} className="device-power" />
      <div style={{ zIndex: '20001' }} className="device-home" />
    </div>
  );
});

Iphone14Pro.propTypes = {};

export default Iphone14Pro;
