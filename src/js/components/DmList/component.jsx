import React from 'react';
import PropTypes from 'prop-types';
import ChatList from '../ChatList';
import { formatDms } from '../../helpers/chatFormatters';

const DmList = ({ hideStarred, team, useDisplayNames }) => (
  <ChatList chats={formatDms(team, hideStarred, useDisplayNames)} team={team} />
);

DmList.propTypes = {
  hideStarred: PropTypes.bool.isRequired,
  team: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  useDisplayNames: PropTypes.bool.isRequired,
};

export default DmList;

