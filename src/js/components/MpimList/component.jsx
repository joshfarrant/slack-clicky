import React from 'react';
import PropTypes from 'prop-types';
import ChatList from '../ChatList';
import { formatMpims } from '../../helpers/chatFormatters';

const MpimList = ({ hideStarred, team }) => (
  <ChatList chats={formatMpims(team, hideStarred)} team={team} />
);

MpimList.propTypes = {
  hideStarred: PropTypes.bool.isRequired,
  team: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default MpimList;

