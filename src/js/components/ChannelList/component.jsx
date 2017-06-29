import React from 'react';
import PropTypes from 'prop-types';
import ChatList from '../ChatList';
import { formatChannels } from '../../helpers/chatFormatters';

const ChannelList = ({ hideStarred, team }) => (
  <ChatList chats={formatChannels(team, hideStarred)} team={team} />
);

ChannelList.propTypes = {
  hideStarred: PropTypes.bool.isRequired,
  team: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default ChannelList;
