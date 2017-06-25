import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import styles from './style.scss';

const Link = ({ children, href }) => (
  <a
    styleName="link"
    href={href}
    rel="noopener noreferrer"
    target="_blank"
  >{children}
  </a>
);

Link.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
};

export default CSSModules(Link, styles);
