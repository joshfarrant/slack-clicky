import { all, put, call, select, takeEvery } from 'redux-saga/effects';
import fetch from 'isomorphic-fetch';
import { notifications as notificationsActions } from '../actions';
import { SLACK } from '../helpers/constants';
import { getUserDisplayName } from '../helpers/chatFormatters';
import { extractLink } from '../helpers/utils';

const {
  CREATE_NOTIFICATION,
  OPEN_NOTIFICATION_LINK,
  MARK_NOTIFICATION_LINK_READ,
  notification: notificationActions,
} = notificationsActions;

const buildNotification = (title, url) => (
  new Promise((resolve, reject) => {
    try {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'assets/icon-purple-128.png',
        title,
        message: '',
        contextMessage: url,
        isClickable: true,
        buttons: [
          { title: 'Mark as read' },
          { title: 'Open link' },
        ],
      }, resolve);
    } catch (error) {
      reject(error);
    }
  })
);

const createTab = url => (
  new Promise((resolve) => {
    chrome.tabs.create({ url }, resolve);
  })
);


function* markNotification(action) {
  const { id } = action.payload;

  // Get notifications and teams states from the store
  const { notifications, teams } = yield select(state => ({
    notifications: state.notifications.notifications,
    teams: state.teams.data,
  }));
  // Find the notification to mark
  const notification = notifications.find(x => x.id === id);
  const { message } = notification;
  const { channel, ts } = message;
  const team = teams[message.team];
  const { token } = team.clicky;
  let baseUrl;

  if (team.channels.some(x => x.id === channel)) {
    baseUrl = SLACK.CHANNEL_MARK_URL;
  } else if (team.groups.some(x => x.id === channel)) {
    baseUrl = SLACK.GROUP_MARK_URL;
  } else {
    baseUrl = SLACK.IM_MARK_URL;
  }

  const url = `${baseUrl}?token=${token}&channel=${channel}&ts=${ts}`;

  return new Promise((resolve, reject) => (
    fetch(url)
    .then(response => response.json())
    .then((json) => {
      chrome.notifications.clear(id);
      return json.ok ? resolve() : reject();
    })
  ));
}

function* openNotificationLink(action) {
  const { id } = action.payload;

  const { notifications } = yield select(state => state.notifications);
  const notification = notifications.find(x => x.id === id);
  const { url } = notification;

  yield call(createTab, url);
  yield put(notificationActions.created({ id, url }));
  yield call(markNotification, action);
}

function* createNotification(action) {
  const { message, team: basicTeam } = action.payload;

  /**
   * Use the ID of the passed team to retreive the full team
   * object from the store, which includes custom properties
   */
  const { teams, notificationsEnabled } = yield select(state => ({
    teams: state.teams.data,
    notificationsEnabled: state.notifications.notificationsEnabled,
  }));

  if (!notificationsEnabled) {
    return;
  }

  const team = teams[basicTeam.team.id];

  // Get the userArray and build map
  const userMap = new Map(team.clicky.userArray);

  // Get the sender of the message
  const messageSender = userMap.get(message.user);
  const senderName = getUserDisplayName(messageSender);

  try {
    const title = `#Clicky from ${senderName}`;
    const { text } = message;
    const url = extractLink(text);


    const id = yield call(buildNotification, title, url);
    yield put(notificationActions.created({ id, message, url }));
  } catch (error) {
    // If something goes wrong, just drop it
  }
}

export default function* watchTeamsActions() {
  yield all([
    takeEvery(CREATE_NOTIFICATION, createNotification),
    takeEvery(OPEN_NOTIFICATION_LINK, openNotificationLink),
    takeEvery(MARK_NOTIFICATION_LINK_READ, markNotification),
  ]);
}
