import action from '../helpers/actionCreator';

export const CLOSED_NOTIFICATION = 'CLOSED_NOTIFICATION';
export const CREATE_NOTIFICATION = 'CREATE_NOTIFICATION';
export const CREATED_NOTIFICATION = 'CREATED_NOTIFICATION';
export const OPEN_NOTIFICATION_LINK = 'OPEN_NOTIFICATION_LINK';
export const MARK_NOTIFICATION_LINK_READ = 'MARK_NOTIFICATION_LINK_READ';

export const notification = {
  closed: (...args) => action(CLOSED_NOTIFICATION, ...args),
  create: (...args) => action(CREATE_NOTIFICATION, ...args),
  created: (...args) => action(CREATED_NOTIFICATION, ...args),
  open: (...args) => action(OPEN_NOTIFICATION_LINK, ...args),
  mark: (...args) => action(MARK_NOTIFICATION_LINK_READ, ...args),
};
