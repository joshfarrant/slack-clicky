import action from '../helpers/actionCreator';

export const AUTHENTICATE_TEAM = 'AUTHENTICATE_TEAM';
export const AUTHENTICATED_TEAM = 'AUTHENTICATED_TEAM';
export const MESSAGE_CLEAR = 'MESSAGE_CLEAR';
export const MESSAGE_SENDING = 'MESSAGE_SENDING';
export const MESSAGE_SENT = 'MESSAGE_SENT';
export const REFRESH_TEAM = 'REFRESH_TEAM';
export const REFRESHED_TEAM = 'REFRESHED_TEAM';
export const REMOVE_TEAM = 'REMOVE_TEAM';
export const SELECT_TEAM = 'SELECT_TEAM';

export const STREAM_CLOSED = 'STREAM_CLOSED';
export const STREAM_SEND_CURRENT_TAB = 'STREAM_SEND_CURRENT_TAB';

export const team = {
  authenticate: (...args) => action(AUTHENTICATE_TEAM, ...args),
  authenticated: (...args) => action(AUTHENTICATED_TEAM, ...args),
  message: {
    clear: (...args) => action(MESSAGE_CLEAR, ...args),
    sending: (...args) => action(MESSAGE_SENDING, ...args),
    sent: (...args) => action(MESSAGE_SENT, ...args),
  },
  refresh: (...args) => action(REFRESH_TEAM, ...args),
  refreshed: (...args) => action(REFRESHED_TEAM, ...args),
  remove: (...args) => action(REMOVE_TEAM, ...args),
  select: (...args) => action(SELECT_TEAM, ...args),
  stream: {
    closed: (...args) => action(STREAM_CLOSED, ...args),
    sendCurrentTab: (...args) => action(STREAM_SEND_CURRENT_TAB, ...args),
  },
};
