import React from 'react';
import PropTypes from 'prop-types';
import ChatList from '../ChatList';
import { formatMpims } from '../../helpers/chatFormatters';

const MpimList = ({ team }) => (
  <ChatList chats={formatMpims(team)} team={team} />
);

MpimList.propTypes = {
  team: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default MpimList;

