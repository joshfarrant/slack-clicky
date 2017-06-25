import React from 'react';
import PropTypes from 'prop-types';
import ChatList from '../ChatList';
import { formatChannels } from '../../helpers/chatFormatters';

const ChannelList = ({ team }) => (
  <ChatList chats={formatChannels(team)} team={team} />
);

ChannelList.propTypes = {
  team: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default ChannelList;
