import baseReducer from './base';
import { teams as teamsActions } from '../actions';
import { MESSAGE_STATES } from '../helpers/constants';

const {
  AUTHENTICATE_TEAM,
  AUTHENTICATED_TEAM,
  MESSAGE_CLEAR,
  MESSAGE_SENDING,
  MESSAGE_SENT,
  REFRESH_TEAM,
  REFRESHED_TEAM,
  REMOVE_TEAM,
  SELECT_TEAM,
  STREAM_CLOSED,
  STREAM_SEND_CURRENT_TAB,
} = teamsActions;

export const defaultState = {
  data: {},
  meta: {
    authenticatingTeam: false,
    refreshingTeam: false,
    selectedTeamId: '',
    channelArray: [],
    groupArray: [],
    userArray: [],
  },
  pending: [],
};

const authenticateTeam = state => ({
  ...state,
  meta: {
    ...state.meta,
    authenticatingTeam: true,
  },
});

const authenticatedTeam = (state, { payload, error }) => {
  const { token } = payload;
  const { pending } = state;
  if (error) {
    return {
      ...state,
      meta: {
        ...state.meta,
        authenticatingTeam: false,
        error: payload.message,
      },
    };
  }

  return {
    ...state,
    meta: {
      ...state.meta,
      authenticatingTeam: false,
    },
    pending: pending.includes(token) ? [...pending] : [...pending, token],
  };
};

const messageClear = (state, { payload }) => {
  const { messageId, team } = payload;
  const teamId = team.team.id;
  const nextMessages = [
    ...state.data[teamId].clicky.messages,
  ].filter(m => m.messageId !== messageId);

  return {
    ...state,
    data: {
      ...state.data,
      [teamId]: {
        ...state.data[teamId],
        clicky: {
          ...state.data[teamId].clicky,
          messages: nextMessages,
        },
      },
    },
  };
};

const messageSending = (state, { payload }) => {
  const { created, channel, messageId, team } = payload;
  const teamId = team.team.id;
  return {
    ...state,
    data: {
      ...state.data,
      [teamId]: {
        ...state.data[teamId],
        clicky: {
          ...state.data[teamId].clicky,
          messages: [
            ...state.data[teamId].clicky.messages,
            {
              created,
              channel,
              messageId,
              status: MESSAGE_STATES.SENDING,
            },
          ],
        },
      },
    },
  };
};

const messageSent = (state, { payload, error }) => {
  const { messageId, team } = payload;
  const teamId = team.team.id;
  const status = error ? MESSAGE_STATES.ERROR : MESSAGE_STATES.SUCCESS;
  // Update the state of our message
  const nextMessages = [
    ...state.data[teamId].clicky.messages,
  ].map(m => (
    m.messageId === messageId ? { ...m, status } : m
  ));
  return {
    ...state,
    data: {
      ...state.data,
      [teamId]: {
        ...state.data[teamId],
        clicky: {
          ...state.data[teamId].clicky,
          messages: nextMessages,
        },
      },
    },
  };
};

const refreshTeam = state => ({
  ...state,
  meta: {
    ...state.meta,
    refreshingTeam: true,
  },
});

const refreshedTeam = (state, { payload, error }) => {
  if (error) {
    return {
      ...state,
      meta: {
        ...state.meta,
        refreshingTeam: false,
      },
    };
  }

  const { stream, team, token } = payload;
  const { id } = team.team;

  return {
    ...state,
    data: {
      ...state.data,
      [id]: {
        ...team,
        clicky: {
          token,
          channelArray: team.channels.map(channel => ([channel.id, channel])),
          groupArray: team.groups.map(group => ([group.id, group])),
          userArray: team.users.map(user => ([user.id, user])),
          messages: [],
          stream: {
            connected: true,
            connecting: false,
            stream,
          },
        },
      },
    },
    meta: {
      ...state.meta,
      refreshingTeam: false,
      selectedTeamId: id,
    },
    pending: [...state.pending].filter(x => x !== token),
  };
};

const removeTeam = (state, { payload }) => {
  const { id } = payload;

  try {
    const windowStream = window.clickyStreams[id];
    windowStream.close();
  } catch (err) {
    // Annoying, but not sure what I can do
  }

  const nextData = { ...state.data };
  delete nextData[id];

  const getNextSelectedTeamId = () => {
    const { selectedTeamId } = state.meta;
    const nextTeamIds = Object.keys(nextData);
    if (nextTeamIds.length === 0) return '';
    // Are we deleting the selected team?
    const isSelectedTeam = id === selectedTeamId;
    // Are there other teams left after deleting this one?
    const hasMultipleTeams = nextTeamIds.length > 0;
    // Should we replace the selectedTeamId
    const replaceSelectedTeam = hasMultipleTeams && isSelectedTeam;
    // return next selectedTeamId
    return replaceSelectedTeam ? nextTeamIds[0] : selectedTeamId;
  };

  return {
    ...state,
    meta: {
      ...state.meta,
      selectedTeamId: getNextSelectedTeamId(),
    },
    data: nextData,
  };
};

const selectTeam = (state, { payload }) => {
  const { id } = payload;
  return {
    ...state,
    meta: {
      ...state.meta,
      selectedTeamId: id,
    },
  };
};

const streamClosed = (state, { payload }) => {
  const { team } = payload;
  const { id } = team.team;
  if (!state.data[id]) {
    return state;
  }
  return {
    ...state,
    data: {
      ...state.data,
      [id]: {
        ...state.data[id],
        clicky: {
          ...state.data[id].clicky,
          stream: {
            connecting: false,
            connected: false,
          },
        },
      },
    },
  };
};

const streamSendCurrentTab = state => state;

const reducer = (
  state,
  action,
) => {
  const { type } = action;
  // Call the supplied function and pass in state and action
  const reduce = reduceFunction => reduceFunction(state, action);

  switch (type) {
    case AUTHENTICATE_TEAM: return reduce(authenticateTeam);
    case AUTHENTICATED_TEAM: return reduce(authenticatedTeam);
    case MESSAGE_CLEAR: return reduce(messageClear);
    case MESSAGE_SENDING: return reduce(messageSending);
    case MESSAGE_SENT: return reduce(messageSent);
    case REFRESH_TEAM: return reduce(refreshTeam);
    case REFRESHED_TEAM: return reduce(refreshedTeam);
    case REMOVE_TEAM: return reduce(removeTeam);
    case SELECT_TEAM: return reduce(selectTeam);
    case STREAM_CLOSED: return reduce(streamClosed);
    case STREAM_SEND_CURRENT_TAB: return reduce(streamSendCurrentTab);
    default: return state;
  }
};

export default baseReducer(defaultState, reducer);
