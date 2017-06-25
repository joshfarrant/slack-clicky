import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import styles from './style.scss';

const TeamIcon = ({ team, ...props }) => (
  <img
    src={team.icon.image_34}
    title={team.name}
    alt={team.name}
    {...props}
    styleName={`${props.styleName || ''} icon`}
  />
);

TeamIcon.propTypes = {
  team: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  styleName: PropTypes.string,
};

TeamIcon.defaultProps = {
  styleName: '',
};

export default CSSModules(TeamIcon, styles, { allowMultiple: true });
