import baseReducer from './base';
import { notifications as notificationsActions } from '../actions';

const {
  CLOSED_NOTIFICATION,
  CREATE_NOTIFICATION,
  CREATED_NOTIFICATION,
  OPEN_NOTIFICATION_LINK,
  MARK_NOTIFICATION_LINK_READ,
} = notificationsActions;

export const defaultState = {
  notifications: [],
};

const closedNotification = (state, { payload }) => {
  const { id } = payload;
  return {
    ...state,
    notifications: [...state.notifications].filter(x => x.id !== id),
  };
};

const createNotification = state => state;

const createdNotification = (state, { payload }) => {
  const { id, message, url } = payload;
  return {
    ...state,
    notifications: [
      ...state.notifications,
      { id, message, url },
    ],
  };
};

const openNotificationLink = state => state;

const markNotificationLinkRead = state => state;

const reducer = (
  state,
  action,
) => {
  const { type } = action;
  // Call the supplied function and pass in state and action
  const reduce = reduceFunction => reduceFunction(state, action);

  switch (type) {
    case CLOSED_NOTIFICATION: return reduce(closedNotification);
    case CREATE_NOTIFICATION: return reduce(createNotification);
    case CREATED_NOTIFICATION: return reduce(createdNotification);
    case OPEN_NOTIFICATION_LINK: return reduce(openNotificationLink);
    case MARK_NOTIFICATION_LINK_READ: return reduce(markNotificationLinkRead);
    default: return state;
  }
};

export default baseReducer(defaultState, reducer);
