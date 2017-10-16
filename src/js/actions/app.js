import action from '../helpers/actionCreator';

export const SET_THEME = 'SET_THEME';
export const SET_THEME_COLOR = 'SET_THEME_COLOR';

export const theme = {
  setColor: (...args) => action(SET_THEME_COLOR, ...args),
  set: (...args) => action(SET_THEME, ...args),
};

export const HIDE_SECTION = 'HIDE_SECTION';
export const SHOW_SECTION = 'SHOW_SECTION';

export const section = {
  hide: (...args) => action(HIDE_SECTION, ...args),
  show: (...args) => action(SHOW_SECTION, ...args),
};

export const SET_MESSAGE = 'SET_MESSAGE';

export const message = {
  set: (...args) => action(SET_MESSAGE, ...args),
};

export const HIDE_ANNOUNCEMENT = 'HIDE_ANNOUNCEMENT';

export const announcement = {
  hide: (...args) => action(HIDE_ANNOUNCEMENT, ...args),
};


export const SET_USE_DISPLAY_NAMES = 'SET_USE_DISPLAY_NAMES';

export const chat = {
  setuseDisplayNames: (...args) => action(SET_USE_DISPLAY_NAMES, ...args),
};

export const GET_CURRENT_TAB_URL = 'GET_CURRENT_TAB_URL';
export const GOT_CURRENT_TAB_URL = 'GOT_CURRENT_TAB_URL';

export const currentTabUrl = {
  get: (...args) => action(GET_CURRENT_TAB_URL, ...args),
  got: (...args) => action(GOT_CURRENT_TAB_URL, ...args),
};

