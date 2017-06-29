import React from 'react';
import PropTypes from 'prop-types';
import ChatList from '../ChatList';
import { formatDms } from '../../helpers/chatFormatters';

const DmList = ({ hideStarred, team }) => (
  <ChatList chats={formatDms(team, hideStarred)} team={team} />
);

DmList.propTypes = {
  hideStarred: PropTypes.bool.isRequired,
  team: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default DmList;

