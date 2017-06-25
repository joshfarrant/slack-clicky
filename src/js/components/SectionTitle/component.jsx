import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import styles from './style.scss';

const SectionTitle = ({ title }) => (
  <div styleName="section-title">{title}</div>
);

SectionTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default CSSModules(SectionTitle, styles);
