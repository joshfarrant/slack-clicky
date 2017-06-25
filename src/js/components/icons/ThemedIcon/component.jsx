import React from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';

const Icon = (props) => {
  const { dark, darkIcon, isDarkMode, light, lightIcon } = props;
  const componentProps = { ...props };
  const propsToDelete = ['dark', 'darkIcon', 'isDarkMode', 'light', 'lightIcon'];
  propsToDelete.forEach(p => delete componentProps[p]);

  // The order of this switch block is important
  switch (true) {
    case dark: // Dark override
      return darkIcon(componentProps);
    case light: // Light overrided
      return lightIcon(componentProps);
    case isDarkMode: // Observe dark mode
      return darkIcon(componentProps);
    default: // Fall back to light
      return lightIcon(componentProps);
  }
};

Icon.propTypes = {
  dark: PropTypes.bool,
  darkIcon: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool,
  light: PropTypes.bool,
  lightIcon: PropTypes.func.isRequired,
};

Icon.defaultProps = {
  dark: false,
  isDarkMode: false,
  light: false,
};

export default Icon;
