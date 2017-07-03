import { wrapStore } from 'react-chrome-redux';
import { REACT_CHROME_REDUX } from './helpers/constants';
import {
  app as appActions,
  notifications as notificationsActions,
  state as stateActions,
  teams as teamsActions,
} from './actions';
import store from './store/index';

const { notification: notificationActions } = notificationsActions;
const { message } = appActions;
const { team: teamActions } = teamsActions;

wrapStore(store, {
  portName: REACT_CHROME_REDUX.PORT_NAME,
});

const {
  dispatch,
  getState,
} = store;

const state = getState();
// let refreshLoop;

const refreshTeams = () => {
  Object.values(state.teams.data).forEach((team) => {
    const { token } = team.clicky;
    dispatch(teamActions.refresh({ token }));
  });
};

refreshTeams();
// if (refreshLoop) {
//   clearInterval(refreshLoop);
// }

// refreshLoop = setInterval(refreshTeams, 5 * 60 * 1000); // Refresh every 5 mins

chrome.notifications.onClicked.addListener((id) => {
  dispatch(notificationActions.open({ id }));
});

chrome.notifications.onButtonClicked.addListener((id, idx) => {
  if (idx === 0) {
    dispatch(notificationActions.mark({ id }));
  } else {
    dispatch(notificationActions.open({ id }));
  }
});

chrome.notifications.onClosed.addListener((id) => {
  dispatch(notificationActions.closed({ id }));
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'CLEAR_STATE') {
    dispatch(stateActions.clear());
    sendResponse({ ok: true });
  }
});

/**
 * onDisconnect fires when popup.html is closed
 * Check that the connection is the one we're
 * expecting then, if it is, clear the message
 */
chrome.runtime.onConnect.addListener((port) => {
  port.onDisconnect.addListener((sender) => {
    const { name } = sender;
    if (name === REACT_CHROME_REDUX.PORT_NAME) {
      dispatch(message.set({ message: '' }));
    }
  });
});
