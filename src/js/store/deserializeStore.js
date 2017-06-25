import { merge } from 'lodash';
import equal from 'deep-equal';

import { defaultState as app } from '../reducers/app';
import { defaultState as notifications } from '../reducers/notifications';
import { defaultState as teams } from '../reducers/teams';

export const defaultStates = {
  app,
  notifications,
  teams,
};

const validate = (state, stateName) => (
  equal(
    merge({}, defaultStates[stateName], state),
    state,
  )
);

const deserializeStore = (persistedData) => {
  try {
    const data = JSON.parse(persistedData);
    const keys = Object.keys(data);
    const filteredState = {};

    // Store pending teams
    const pendingTeams = Object.values(data.teams.data)
    .map(team => team.clicky.token);

    keys.forEach((key) => {
      if (validate(data[key], key)) {
        filteredState[key] = data[key];
      } else {
        filteredState[key] = defaultStates[key];
      }
    });

    // Put the pending teams back so users don't have to re-auth
    const finalState = {
      ...filteredState,
      teams: {
        ...filteredState.teams,
        pending: pendingTeams,
      },
    };

    return finalState;
  } catch (err) {
    return defaultStates;
  }
};

export default deserializeStore;
