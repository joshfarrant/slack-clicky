import React from 'react';
import PropTypes from 'prop-types';
import ChatList from '../ChatList';
import { formatIms } from '../../helpers/chatFormatters';

const ImList = ({ hideStarred, team }) => (
  <ChatList chats={formatIms(team, hideStarred)} team={team} />
);

ImList.propTypes = {
  hideStarred: PropTypes.bool.isRequired,
  team: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default ImList;

