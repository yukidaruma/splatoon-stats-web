/* eslint-disable no-console */
/* eslint-disable no-return-assign, no-param-reassign */
/* eslint-disable @typescript-eslint/no-var-requires */

const axios = require('axios');
const fs = require('fs');

const USER_AGENT = `https://github.com/yukidaruma/splatoon-stats-api/${process.env.npm_package_version}`;
const client = axios.create({ headers: { 'User-Agent': USER_AGENT } });

const downloadWeapons = async () => {
  const res = await client.get('https://stat.ink/api/v2/weapon');
  const statInkWeapons = res.data;
  return statInkWeapons;
};

const optimizeTranslation = (translation) => {
  /** @type Record<string, Record<any, { name: string; }>> */
  const value = { ...translation };
  delete value.coop_special_weapons;
  delete value.coop_stages;
  delete value.festivals;

  return Object.entries(value).reduce((result, [key, category]) => {
    result[key] = Object.entries(category).reduce((map, [id, { name }]) => {
      map[id] = name;
      return map;
    }, {});
    return result;
  }, {});
};

const entrypoint = async () => {
  const statInkWeapons = await downloadWeapons();

  const locales = { en: 'en_US', ja: 'ja_JP' };
  await Promise.all(
    Object.entries(locales).map(async ([lang, locale]) => {
      const cachePath = `locales/${lang}/splatoon.json`;
      const res = await client.get(`https://splatoon2.ink/data/locale/${lang}.json`);
      const localeData = res.data;

      // locale data from splatoon2.ink has missing weapons, so we use stat.ink data instead.
      const weapons = Object.fromEntries(
        statInkWeapons.map((weapon) => [weapon.splatnet, { name: weapon.name[locale] }]),
      );
      localeData.weapons = weapons;

      fs.writeFileSync(
        cachePath,
        JSON.stringify({
          ...optimizeTranslation(localeData),
        }) + '\n',
      );

      console.log(`Generated ${cachePath}.`);
    }),
  );
};

entrypoint();
