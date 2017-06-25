import action from '../helpers/actionCreator';

export * as app from './app';
export * as notifications from './notifications';
export * as teams from './teams';

export const CLEAR_STATE = 'CLEAR_STATE';
export const state = {
  clear: (...args) => action(CLEAR_STATE, ...args),
};
