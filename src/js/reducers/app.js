import baseReducer from './base';
import { CHAT_LISTS, THEMES, THEME_COLORS } from '../helpers/constants';
import { app as appActions } from '../actions';

const {
  SET_THEME,
  SET_THEME_COLOR,
  HIDE_SECTION,
  SET_MESSAGE,
  SHOW_SECTION,
  HIDE_ANNOUNCEMENT,
  SET_USE_DISPLAY_NAMES,
  GET_CURRENT_TAB_URL,
  GOT_CURRENT_TAB_URL,
} = appActions;

export const defaultState = {
  hiddenAnnouncements: [],
  message: '',
  theme: THEMES.DEFAULT,
  themeColor: THEME_COLORS.PINK,
  visibleSections: [
    CHAT_LISTS.CHANNEL_LIST.NAME,
    CHAT_LISTS.DM_LIST.NAME,
  ],
  useDisplayNames: false,
  currentTabUrl: '',
  gettingCurrentTabUrl: false,
};

const setMessage = (state, { payload }) => {
  const { message } = payload;
  return {
    ...state,
    message,
  };
};

const setTheme = (state, { payload }) => {
  const { theme } = payload;
  return {
    ...state,
    theme,
  };
};

const setThemeColor = (state, { payload }) => {
  const { color } = payload;
  return {
    ...state,
    themeColor: color,
  };
};

const hideSection = (state, { payload }) => {
  const { section } = payload;
  return {
    ...state,
    visibleSections: [
      ...state.visibleSections.filter(x => x !== section),
    ],
  };
};

const showSection = (state, { payload }) => {
  const { section } = payload;
  const { visibleSections } = state;
  if (visibleSections.includes(section)) {
    return state;
  }
  return {
    ...state,
    visibleSections: [
      ...state.visibleSections,
      section,
    ],
  };
};

const hideAnnouncement = (state, { payload }) => {
  const { id } = payload;
  const hidden = state.hiddenAnnouncements;
  const hiddenAnnouncements = hidden.includes(id) ? [...hidden] : [...hidden, id];
  return {
    ...state,
    hiddenAnnouncements,
  };
};

const setUseDisplayNames = (state, { payload }) => {
  const { useDisplayNames } = payload;
  return {
    ...state,
    useDisplayNames,
  };
};

const getCurrentTabUrl = state => ({
  ...state,
  gettingCurrentTabUrl: true,
});

const gotCurrentTabUrl = (state, { payload }) => {
  const { currentTabUrl } = payload;
  return {
    ...state,
    currentTabUrl,
    gettingCurrentTabUrl: false,
  };
};

const reducer = (
  state,
  action,
) => {
  const { type } = action;
  // Call the supplied function and pass in state and action
  const reduce = reduceFunction => reduceFunction(state, action);

  switch (type) {
    case SET_MESSAGE: return reduce(setMessage);
    case SET_THEME: return reduce(setTheme);
    case SET_THEME_COLOR: return reduce(setThemeColor);
    case HIDE_SECTION: return reduce(hideSection);
    case SHOW_SECTION: return reduce(showSection);
    case HIDE_ANNOUNCEMENT: return reduce(hideAnnouncement);
    case SET_USE_DISPLAY_NAMES: return reduce(setUseDisplayNames);
    case GET_CURRENT_TAB_URL: return reduce(getCurrentTabUrl);
    case GOT_CURRENT_TAB_URL: return reduce(gotCurrentTabUrl);
    default: return state;
  }
};

export default baseReducer(defaultState, reducer);
