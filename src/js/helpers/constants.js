export const CHAT_LISTS = {
  STARRED_CHAT_LIST: {
    DESCRIPTION: 'All starred chats',
    NAME: 'STARRED_CHAT_LIST',
    TITLE: 'Starred',
  },
  CHANNEL_LIST: {
    DESCRIPTION: 'All public and private channels',
    NAME: 'CHANNEL_LIST',
    TITLE: 'All Channels',
  },
  DM_LIST: {
    DESCRIPTION: 'Direct messages to one or more users',
    NAME: 'DM_LIST',
    TITLE: 'Direct Messages',
  },
  IM_LIST: {
    DESCRIPTION: 'Direct messages to a single user',
    NAME: 'IM_LIST',
    TITLE: 'Instant Messages',
  },
  MPIM_LIST: {
    DESCRIPTION: 'Direct messages to multiple users',
    NAME: 'MPIM_LIST',
    TITLE: 'Group Instant Messages',
  },
  PRIVATE_CHANNEL_LIST: {
    DESCRIPTION: 'All private channels',
    NAME: 'PRIVATE_CHANNEL_LIST',
    TITLE: 'Private Channels',
  },
  PUBLIC_CHANNEL_LIST: {
    DESCRIPTION: 'All public channels',
    NAME: 'PUBLIC_CHANNEL_LIST',
    TITLE: 'Public Channels',
  },
};

export const ENVIRONMENT = {
  PRODUCTION: process.env.NODE_ENV === 'production',
  DEVELOPMENT: process.env.NODE_ENV === 'development',
  TESTING: process.env.NODE_ENV === 'testing',
};

export const MESSAGE_STATES = {
  ERROR: 'ERROR',
  SENDING: 'SENDING',
  SUCCESS: 'SUCCESS',
};

export const PRODUCT = {
  NAME: '#Clicky',
};

export const REACT_CHROME_REDUX = {
  PORT_NAME: 'clicky',
};

export const ROUTES = {
  ABOUT: {
    ROUTE: '/about',
    NAME: 'About',
  },
  HOME: {
    ROUTE: '/popup.html',
    NAME: PRODUCT.NAME,
  },
  SETTINGS: {
    ROUTE: '/settings',
    NAME: 'Settings',
  },
  TEAMS: {
    ROUTE: '/teams',
    NAME: 'Teams',
  },
};

export const SENTRY = {
  DSN: 'https://20681ca538f3415d907d8d56f0fe8d40@sentry.io/155158',
};

export const SKUS = {
  PAID_TIER: 'clicky_paid_tier',
};

export const SLACK = {
  SLACKBOT_USER: 'USLACKBOT',
  AUTHORIZE_URL: 'https://slack.com/oauth/authorize',
  buildAuthorizeUrl: ({ clientId, scope, redirectUri }) => (
    `${SLACK.AUTHORIZE_URL}?client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}`
  ),
  ACCESS_URL: 'https://slack.com/api/oauth.access',
  buildAccessUrl: ({ clientId, clientSecret, redirectUri, code }) => (
    `${SLACK.ACCESS_URL}?client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectUri}&code=${code}`
  ),
  CHANNEL_MARK_URL: 'https://slack.com/api/channels.mark',
  GROUP_MARK_URL: 'https://slack.com/api/groups.mark',
  IM_MARK_URL: 'https://slack.com/api/im.mark',
};

export const THEMES = {
  DEFAULT: 'DEFAULT',
  DARK: 'DARK',
};

export const THEME_COLORS = {
  PINK: 'var(--p-pink-color)',
  YELLOW: 'var(--p-yellow-color)',
  GREEN: 'var(--p-green-color)',
  BLUE: 'var(--p-blue-color)',
};
