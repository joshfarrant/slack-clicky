import React from 'react';
import PropTypes from 'prop-types';
import ChatList from '../ChatList';
import { formatIms } from '../../helpers/chatFormatters';

const ImList = ({ team }) => (
  <ChatList chats={formatIms(team)} team={team} />
);

ImList.propTypes = {
  team: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default ImList;

