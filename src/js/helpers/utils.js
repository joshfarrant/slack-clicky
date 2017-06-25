// Matches urls
const linkRegex = /(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])/;

// Matches links with optional label <link|label>
export const isLink = text => linkRegex.test(text);

// Is timestamp within last 5 seconds?
export const isRecent = ts => parseInt(ts, 10) > ((Date.now() / 1000) - 5);

export const extractLink = text => linkRegex.exec(text)[0];

export const shouldNotify = (message, team) => {
  const conditions = [
    message.type === 'message',
    !message.subtype,
    !message.hidden,
    isRecent(message.ts),
    isLink(message.text),
    message.user !== team.self.id,
  ];

  // If all conditions are true, return true, else return false
  return conditions.every(x => x);
};

export const buildRandomId = (length) => {
  let id = '';
  const options = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    id += options.charAt(Math.floor(Math.random() * options.length));
  }

  return id;
};

export const getUniqueId = (prefix = 'id') => `${prefix}-${buildRandomId(10)}`;
