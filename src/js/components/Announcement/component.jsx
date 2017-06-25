import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import CrossIcon from '../icons/CrossIcon';
import styles from './style.scss';

const Announcement = ({
  hiddenAnnouncements,
  id,
  message,
  onClose,
  title,
}) => {
  if (id && hiddenAnnouncements.includes(id)) {
    return null;
  }

  return (
    <div styleName="container">
      {onClose && (
        <div
          styleName="close"
          onClick={onClose}
        >
          <CrossIcon />
        </div>
      )}
      {title && <span styleName="title">{title}</span>}
      {message && <span styleName="message">{message}</span>}
    </div>
  );
};

Announcement.propTypes = {
  hiddenAnnouncements: PropTypes.arrayOf(PropTypes.string).isRequired,
  id: PropTypes.string,
  onClose: PropTypes.func,
  message: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
};

Announcement.defaultProps = {
  id: null,
  onClose: () => {},
};

export default CSSModules(Announcement, styles);
