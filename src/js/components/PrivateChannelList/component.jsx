import React from 'react';
import PropTypes from 'prop-types';
import ChatList from '../ChatList';
import { formatPrivateChannels } from '../../helpers/chatFormatters';

const PrivateChannelList = ({ team }) => (
  <ChatList chats={formatPrivateChannels(team)} team={team} />
);

PrivateChannelList.propTypes = {
  team: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default PrivateChannelList;

