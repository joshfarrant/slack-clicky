const webpack = require('webpack'); // eslint-disable-line import/no-extraneous-dependencies
const config = require('../webpack.config');

require('./prepare');

webpack(
  config,
  (err) => { if (err) throw err; },
);
