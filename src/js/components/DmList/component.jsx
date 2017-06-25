import React from 'react';
import PropTypes from 'prop-types';
import ChatList from '../ChatList';
import { formatDms } from '../../helpers/chatFormatters';

const DmList = ({ team }) => (
  <ChatList chats={formatDms(team)} team={team} />
);

DmList.propTypes = {
  team: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default DmList;

