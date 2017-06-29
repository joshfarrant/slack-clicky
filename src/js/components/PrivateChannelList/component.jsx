import React from 'react';
import PropTypes from 'prop-types';
import ChatList from '../ChatList';
import { formatPrivateChannels } from '../../helpers/chatFormatters';

const PrivateChannelList = ({ hideStarred, team }) => (
  <ChatList chats={formatPrivateChannels(team, hideStarred)} team={team} />
);

PrivateChannelList.propTypes = {
  hideStarred: PropTypes.bool.isRequired,
  team: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default PrivateChannelList;

