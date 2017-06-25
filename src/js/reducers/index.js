import { combineReducers } from 'redux';
import app from './app';
import notifications from './notifications';
import teams from './teams';

const appReducer = combineReducers({
  app,
  notifications,
  teams,
});

const rootReducer = (state, action) => {
  let nextState = state;
  if (action.type === 'CLEAR_STATE') {
    nextState = {};
  }

  return appReducer(nextState, action);
};

export default rootReducer;
