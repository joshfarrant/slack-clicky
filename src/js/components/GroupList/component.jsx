import React from 'react';
import PropTypes from 'prop-types';
import ChatList from '../ChatList';
import { formatGroups } from '../../helpers/chatFormatters';

const GroupList = ({ hideStarred, team }) => (
  <ChatList chats={formatGroups(team, hideStarred)} team={team} />
);

GroupList.propTypes = {
  hideStarred: PropTypes.bool.isRequired,
  team: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default GroupList;

