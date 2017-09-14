import React from 'react';
import PropTypes from 'prop-types';
import ChatList from '../ChatList';
import { formatGroups } from '../../helpers/chatFormatters';

const GroupList = ({ hideStarred, team, useDisplayNames }) => (
  <ChatList chats={formatGroups(team, hideStarred, useDisplayNames)} team={team} />
);

GroupList.propTypes = {
  hideStarred: PropTypes.bool.isRequired,
  team: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  useDisplayNames: PropTypes.bool.isRequired,
};

export default GroupList;

