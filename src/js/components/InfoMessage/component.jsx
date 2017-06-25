import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import styles from './style.scss';

const InfoMessage = ({ children, fullScreen, icon, title }) => (
  <div styleName={fullScreen ? 'container-full' : 'container'}>
    {icon && (
      <div styleName="icon">{icon}</div>
    )}
    <div styleName="title">
      {title}
    </div>
    <div styleName="body">
      {children}
    </div>
  </div>
);

InfoMessage.propTypes = {
  children: PropTypes.node.isRequired,
  fullScreen: PropTypes.bool,
  icon: PropTypes.element,
  title: PropTypes.string.isRequired,
};

InfoMessage.defaultProps = {
  fullScreen: false,
  icon: '',
};

export default CSSModules(InfoMessage, styles);
