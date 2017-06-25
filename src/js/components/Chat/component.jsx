import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { MESSAGE_STATES } from '../../helpers/constants';
import styles from './style.scss';

const Chat = ({ id, label, onClick, status, team }) => {
  let styleName = 'chat';

  const isSending = status === MESSAGE_STATES.SENDING;
  const isSuccess = status === MESSAGE_STATES.SUCCESS;
  const isError = status === MESSAGE_STATES.ERROR;

  const canClick = !isSending && !isSuccess;

  if (isSending) {
    styleName = 'chat-sending';
  }

  if (isSuccess) {
    styleName = 'chat-success';
  }

  if (isError) {
    styleName = 'chat-error';
  }

  return (
    <li
      styleName={styleName}
      onClick={() => canClick && onClick(id, team)}
    >
      {label}
    </li>
  );
};

Chat.defaultProps = {
  status: null,
};

Chat.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  status: PropTypes.oneOf([
    ...Object.values(MESSAGE_STATES),
    null,
  ]),
  team: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default CSSModules(Chat, styles);
