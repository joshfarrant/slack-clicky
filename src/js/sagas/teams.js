import { all, put, call, select, takeEvery, takeLatest } from 'redux-saga/effects';
import fetch from 'isomorphic-fetch';
import parse from 'url-parse';
import slack from 'slack';
import config from 'config'; // eslint-disable-line
import { SLACK } from '../helpers/constants';
import { shouldNotify } from '../helpers/utils';
import { formatChannels, formatDms } from '../helpers/chatFormatters';
import { customChannel } from './customChannel';
import {
  notifications as notificationsActions,
  teams as teamsActions,
} from '../actions';

const {
  AUTHENTICATE_TEAM,
  AUTHENTICATED_TEAM,
  REFRESH_TEAM,
  STREAM_SEND_CURRENT_TAB,
  team: teamActions,
} = teamsActions;

const { notification } = notificationsActions;

const pendingMessages = {};

const {
  clientId,
  clientSecret,
  redirectUri,
  scope,
} = config.slack;

const getSlackToken = () => (
  new Promise((resolve, reject) => (
    chrome.identity.launchWebAuthFlow({
      url: SLACK.buildAuthorizeUrl({ clientId, scope, redirectUri }),
      interactive: true,
    }, (redirectUrl) => {
      // Get the query params from the provided redirect URL
      const { query } = parse(redirectUrl, true);
      // Extract the access code from the query params
      const { code } = query;

      const accessUrl = SLACK.buildAccessUrl({ clientId, clientSecret, redirectUri, code });

      // Resolve with the access token, or reject on error
      fetch(accessUrl)
      .then(response => response.json())
      .then(json => json.access_token)
      .then(resolve)
      .catch(reject);
    })
  ))
);

const connectToStream = token => (
  new Promise((resolve, reject) => {
    // Instantiate stream
    const stream = slack.rtm.client();

    // Reject after 5s timeout
    const timeout = setTimeout(() => {
      reject(new Error('Connecting to stream timed out'));
    }, 5000);

    // Bind started callback
    stream.started((team) => {
      // Make sure we don't time out
      clearTimeout(timeout);

      // Bind message callback
      stream.message((message) => {
        // If we should notify, then notify
        if (shouldNotify(message, team)) {
          customChannel.put(notification.create({ message, team }));
        }
      });

      // Bind more general ws.onmessage listener
      stream.ws.addEventListener('message', (e) => {
        try {
          const message = JSON.parse(e.data);
          // Check to see if this is a response to a sent message
          const messageId = message.reply_to;
          if (Object.prototype.hasOwnProperty.call(pendingMessages, messageId)) {
            if (message.ok === true) {
              // We're waiting on a response to this message, and we got an ok
              customChannel.put(teamActions.message.sent({ messageId, team }));
            } else {
              // We got a non-ok response to our message
              customChannel.put(teamActions.message.sent({ messageId, team }, true));
            }
            delete pendingMessages[messageId];
            setTimeout(() => {
              customChannel.put(teamActions.message.clear({ messageId, team }));
            }, 3000);
          }
        } catch (err) {
          // Ignore the error
        }
      });

      // Resolve with stream and team as returned from rtm.start
      resolve({ stream, team });
    });

    // Connect stream instance
    stream.listen({ token });
  })
);

const getActiveTabUrl = () => (
  new Promise((resolve) => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      if (!tabs || !tabs[0]) {
        resolve();
        return;
      }
      const url = tabs[0].url;
      resolve(url);
    });
  })
);

function* authenticateTeam(action) {
  // Run Chrome's auth flow and get a token
  try {
    const token = yield call(getSlackToken, action);
    yield put(teamActions.authenticated({ token }));
  } catch (error) {
    // Authentication error
    const { message } = error;
    yield put(teamActions.authenticated({ message }, true));
  }
}

const createContextMenu = (title, id, ...args) => (
  new Promise((resolve) => {
    let parentId;
    let onClick;
    // If we've got 2 args, they're parentId and onClick respectively
    if (args.length === 2) {
      parentId = args[0];
      onClick = args[1];
    } else if (args.length === 1) {
      if (typeof args[0] === 'function') {
        // If we've only got one and it's a function, it's onClick
        onClick = args[0];
      } else if (typeof args[0] === 'string') {
        // If we've only got one and it's a string, it's parentId
        parentId = args[0];
      }
    }
    chrome.contextMenus.create({
      title,
      id,
      parentId,
      type: 'normal',
      contexts: ['selection'],
      onclick: onClick,
    }, resolve);
  })
);

function* buildContextMenus() {
  const teams = yield select(state => state.teams.data);
  const teamsArr = Object.values(teams);
  const mainId = 'clicky';

  const onClick = (info, tab) => {
    const {
      menuItemId: channel,
      parentMenuItemId: teamId,
      selectionText,
    } = info;

    const { url } = tab;

    const text = `>_"${selectionText}"_ - ${url}`;
    const team = teams[teamId];
    customChannel.put(teamActions.stream.sendCurrentTab({ channel, team, text }));
  };

  chrome.contextMenus.removeAll(() => {
    createContextMenu('#Clicky', mainId)
    .then(() => {
      // Iterate through teams
      teamsArr.forEach((t) => {
        const teamId = t.team.id;

        // Create a sub menu for each
        createContextMenu(t.team.name, teamId, mainId)
        .then(() => {
          // Iterate through channels
          formatChannels(t)
          .forEach(({ id, label }) => {
            // Create a sub menu for each
            createContextMenu(label, id, teamId, onClick);
          });

          // Iterate through users
          formatDms(t)
          .forEach(({ id, label }) => {
            // Create a sub menu for each
            createContextMenu(label, id, teamId, onClick);
          });
        });
      });
    });
  });
}

function* refreshTeam(action) {
  const { token } = action.payload;

  try {
    // Set up stream
    const { stream, team } = yield call(connectToStream, token);

    stream.ws.onclose = () => {
      customChannel.put(teamActions.stream.closed({ team }));
    };

    yield buildContextMenus();

    yield put(teamActions.refreshed({ stream, team, token }));
  } catch (error) {
    // Stream connection error
    const { message } = error;
    yield put(teamActions.refreshed({ message }, true));
  }
}

function* sendMessage(action) {
  const { channel, team, text } = action.payload;
  const { id } = team.team;
  const { message, stream } = yield select(state => ({
    message: state.app.message,
    stream: state.teams.data[id].clicky.stream.stream,
  }));

  // Let's be super sure we've got everything we need
  if (!stream || !stream.ws || !stream.ws.send) {
    yield put(teamActions.refresh({ token: team.clicky.token }));
    return;
  }

  const messageId = Math.floor(Math.random() * 9000000) + 1000000;

  const created = Date.now();
  yield put(teamActions.message.sending({ created, channel, messageId, team }));

  getActiveTabUrl()
  .then((url) => {
    let messageText;
    if (text) {
      messageText = text;
    } else {
      messageText = message ? `${message} ${url}` : url;
    }
    const data = {
      id: messageId,
      type: 'message',
      channel,
      text: messageText,
    };

    const { ws } = stream;

    ws.send(JSON.stringify(data));

    // Add the message to the pending messages object
    pendingMessages[messageId] = data;

    // After 1 second consider the message errored
    setTimeout(() => {
      // If it's still in the pendingMessages, error and delete it
      if (Object.prototype.hasOwnProperty.call(pendingMessages, messageId)) {
        // Timed out, remove the message
        customChannel.put(teamActions.message.sent({ messageId, team }, true));
        delete pendingMessages[messageId];
      }
    }, 1000);
  });
}

export default function* watchTeamsActions() {
  yield all([
    takeLatest(AUTHENTICATE_TEAM, authenticateTeam),
    takeEvery(AUTHENTICATED_TEAM, refreshTeam),
    takeEvery(REFRESH_TEAM, refreshTeam),
    takeEvery(STREAM_SEND_CURRENT_TAB, sendMessage),
  ]);
}
