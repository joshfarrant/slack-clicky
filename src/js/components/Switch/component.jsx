import React from 'react';
import PropTypes from 'prop-types';
import BaseCheckbox from '../BaseCheckbox';

const Switch = props => (
  <BaseCheckbox
    kind="switch"
    {...props}
  />
);

Switch.propTypes = {
  checked: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func,
};

Switch.defaultProps = {
  checked: false,
  label: '',
  onChange: () => {},
};

export default Switch;
