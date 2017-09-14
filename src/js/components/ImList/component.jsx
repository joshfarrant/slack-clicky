import React from 'react';
import PropTypes from 'prop-types';
import ChatList from '../ChatList';
import { formatIms } from '../../helpers/chatFormatters';

const ImList = ({ hideStarred, team, useDisplayNames }) => (
  <ChatList chats={formatIms(team, hideStarred, useDisplayNames)} team={team} />
);

ImList.propTypes = {
  hideStarred: PropTypes.bool.isRequired,
  team: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  useDisplayNames: PropTypes.bool.isRequired,
};

export default ImList;

