/* eslint-disable @typescript-eslint/no-var-requires */
const nextTranslate = require('next-translate');

module.exports = {
  ...nextTranslate(),
  env: {
    SPLATOON_STATS_API_URL:
      process.env.SPLATOON_STATS_API_URL ?? 'https://splatoon-stats-api.yuki.games',
  },
};
