import React from 'react';
import PropTypes from 'prop-types';
import Header from '../Header';

const RouteWrapper = ({ children, location }) => (
  <div>
    <Header location={location} />
    {children}
  </div>
);

RouteWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.objectOf(
    PropTypes.string,
  ).isRequired,
};

export default RouteWrapper;
