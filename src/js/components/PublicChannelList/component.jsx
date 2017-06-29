import React from 'react';
import PropTypes from 'prop-types';
import ChatList from '../ChatList';
import { formatPublicChannels } from '../../helpers/chatFormatters';

const PublicChannelList = ({ hideStarred, team }) => (
  <ChatList chats={formatPublicChannels(team, hideStarred)} team={team} />
);

PublicChannelList.propTypes = {
  hideStarred: PropTypes.bool.isRequired,
  team: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default PublicChannelList;
