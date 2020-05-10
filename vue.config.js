const webpack = require('webpack');

module.exports = {
  lintOnSave: false,
  configureWebpack() {
    let plugins;

    if (process.env.NODE_ENV === 'production') {
      plugins = [
        new webpack.DefinePlugin({ VUE_APP_API_URL: JSON.stringify('https://splatoon-stats-api.yuki.games') }),
      ];
    } else {
      plugins = [
        new webpack.DefinePlugin({
          // eslint-disable-next-line no-template-curly-in-string
          VUE_APP_API_URL: "'http://' + location.hostname + ':3000'",
        }),
      ];
    }

    return { plugins };
  },
};
