import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import Chat from '../Chat';
import styles from './style.scss';

const ChatList = ({ chats, chatClick, team }) => (
  <div styleName="container">
    <ul styleName="list">
      {chats.map(c => (
        <Chat
          key={c.id}
          id={c.id}
          onClick={() => chatClick(c.id, team)}
          label={c.label}
          team={team}
        />
      ))}
    </ul>
  </div>
);

ChatList.propTypes = {
  chats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
  chatClick: PropTypes.func.isRequired,
  team: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

ChatList.defaultProps = {
  chats: [],
};

export default CSSModules(ChatList, styles);
