import React from 'react';
import PropTypes from 'prop-types';
import ChatList from '../ChatList';
import { formatStarredChats } from '../../helpers/chatFormatters';

const StarredChatList = ({ team, useDisplayNames }) => (
  <ChatList chats={formatStarredChats(team, useDisplayNames)} team={team} />
);

StarredChatList.propTypes = {
  team: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  useDisplayNames: PropTypes.bool.isRequired,
};

export default StarredChatList;

