import React from 'react';
import PropTypes from 'prop-types';
import ChatList from '../ChatList';
import { formatStarredChats } from '../../helpers/chatFormatters';

const StarredChatList = ({ team }) => (
  <ChatList chats={formatStarredChats(team)} team={team} />
);

StarredChatList.propTypes = {
  team: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default StarredChatList;

