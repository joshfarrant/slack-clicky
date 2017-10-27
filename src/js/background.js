import { wrapStore } from 'react-chrome-redux';
import { REACT_CHROME_REDUX, SKUS } from './helpers/constants';
import {
  app as appActions,
  notifications as notificationsActions,
  state as stateActions,
  teams as teamsActions,
} from './actions';
import store from './store/index';
import './buy.js';

const { notification: notificationActions } = notificationsActions;
const { currentTabUrl, message } = appActions;
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

window.hasPaidTier = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'CLEAR_STATE') {
    dispatch(stateActions.clear());
    sendResponse({ ok: true });
  } else if (request.type === 'BUY_PAID_TIER') {
    // Buy the paid tier
    google.payments.inapp.buy({
      parameters: { env: 'prod' },
      sku: SKUS.PAID_TIER,
      success: () => {
        window.hasPaidTier = true;
        chrome.runtime.reload();
      },
      failure: () => {
        chrome.runtime.reload();
      },
    });
  }
});

// const checkForPaidTier = () => (
//   new Promise((resolve) => {
//     // Check for paid tier
//     google.payments.inapp.getPurchases({
//       parameters: { env: 'prod' },
//       success: (data) => {
//         const products = data.response.details;
//         // Is correct SKU, and is active
//         const hasPaidTier = products.some(x => x.sku === SKUS.PAID_TIER && x.state === 'ACTIVE');
//         window.hasPaidTier = hasPaidTier;
//         resolve(hasPaidTier);
//       },
//       failure: () => {
//         /**
//          * If in doubt, just assume they've bought it... It's just easier this way
//          * It stops people getting mad at me if (when) my code breaks
//          */
//         window.hasPaidTier = true;
//         resolve(true);
//       },
//     });
//   })
// );

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
      dispatch(currentTabUrl.got({ currentTabUrl: '' }));
    }
  });
});
