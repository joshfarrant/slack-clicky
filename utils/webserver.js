const WebpackDevServer = require('webpack-dev-server'); // eslint-disable-line import/no-extraneous-dependencies
const webpack = require('webpack');  // eslint-disable-line import/no-extraneous-dependencies
const config = require('../webpack.config');
const env = require('./env');
const path = require('path');

require('./prepare');

const options = (config.chromeExtensionBoilerplate || {});
const excludeEntriesToHotReload = (options.notHotReload || []);

for (const entryName in config.entry) {  // eslint-disable-line no-restricted-syntax
  if (excludeEntriesToHotReload.indexOf(entryName) === -1) {
    config.entry[entryName] = [
      `webpack-dev-server/client?http://localhost:${env.PORT}`,
      'webpack/hot/dev-server',
    ].concat(config.entry[entryName]);
  }
}

config.plugins =
  [new webpack.HotModuleReplacementPlugin()].concat(config.plugins || []);

const compiler = webpack(config);

const server = new WebpackDevServer(compiler, {
  hot: true,
  contentBase: path.join(__dirname, '../build'),
  headers: { 'Access-Control-Allow-Origin': '*' },
});

server.listen(env.PORT);
