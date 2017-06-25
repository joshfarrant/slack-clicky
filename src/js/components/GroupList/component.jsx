import React from 'react';
import PropTypes from 'prop-types';
import ChatList from '../ChatList';
import { formatGroups } from '../../helpers/chatFormatters';

const GroupList = ({ team }) => (
  <ChatList chats={formatGroups(team)} team={team} />
);

GroupList.propTypes = {
  team: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default GroupList;

