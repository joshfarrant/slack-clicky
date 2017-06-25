import React from 'react';
import PropTypes from 'prop-types';
import BaseCheckbox from '../BaseCheckbox';

const Checkbox = props => (
  <BaseCheckbox
    kind="checkbox"
    {...props}
  />
);

Checkbox.propTypes = {
  checked: PropTypes.bool,
  info: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
};

Checkbox.defaultProps = {
  checked: false,
  info: '',
  label: '',
  onChange: () => {},
};

export default Checkbox;
