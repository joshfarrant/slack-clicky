import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import ReactTooltip from 'react-tooltip';
import InfoIcon from '../icons/InfoIcon';
import styles from './style.scss';

const SectionTitle = ({ info, title }) => (
  <div styleName="container">
    <div styleName="section-title">{title}</div>
    {info && (
      <div styleName="icon-container">
        <InfoIcon
          styleName="info-icon"
          data-tip={info}
        />
        <ReactTooltip
          delayShow={300}
          effect="solid"
          place="bottom"
          type="dark"
        />
      </div>
    )}
  </div>
);

SectionTitle.propTypes = {
  info: PropTypes.string,
  title: PropTypes.string.isRequired,
};

SectionTitle.defaultProps = {
  info: '',
};

export default CSSModules(SectionTitle, styles);
