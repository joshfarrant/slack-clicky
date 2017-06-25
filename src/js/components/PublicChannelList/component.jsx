import React from 'react';
import PropTypes from 'prop-types';
import ChatList from '../ChatList';
import { formatPublicChannels } from '../../helpers/chatFormatters';

const PublicChannelList = ({ team }) => (
  <ChatList chats={formatPublicChannels(team)} team={team} />
);

PublicChannelList.propTypes = {
  team: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default PublicChannelList;
