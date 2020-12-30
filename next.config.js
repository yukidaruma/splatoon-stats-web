/* eslint-disable @typescript-eslint/no-var-requires */
const nextTranslate = require('next-translate');

const packageJson = require('./package.json');

module.exports = {
  ...nextTranslate(),
  env: {
    APP_NAME: 'Splatoon Stats',
    REPO_URL: packageJson.repository.url,
    SPLATOON_STATS_API_URL:
      process.env.SPLATOON_STATS_API_URL ?? 'https://splatoon-stats-api.yuki.games',
  },
};
