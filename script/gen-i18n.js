/* eslint-disable no-console */

const axios = require('axios');
const fs = require('fs');
const uiLocalization = require('../locales');

const USER_AGENT = `https://github.com/yukidaruma/splatoon-stats-api/${process.env.npm_package_version}`;
const client = axios.create({ headers: { 'User-Agent': USER_AGENT } });

const downloadWeapons = async () => {
  const res = await client.get('https://stat.ink/api/v2/weapon');
  const statInkWeapons = res.data;
  return statInkWeapons;
};

const entrypoint = async () => {
  const cacheDir = 'cache/locale';
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  const statInkWeapons = await downloadWeapons();

  const locales = { ja: 'ja_JP', en: 'en_US' };
  await Promise.all(
    Object.entries(locales).map(async ([lang, locale]) => {
      const cachePath = `${cacheDir}/${lang}.json`;
      const res = await client.get(`https://splatoon2.ink/data/locale/${lang}.json`);
      const localeData = res.data;

      // Find and complete missing translations
      statInkWeapons
        .filter((weapon) => !localeData.weapons[weapon.splatnet])
        .forEach((weapon) => {
          localeData.weapons[weapon.splatnet] = { name: weapon.name[locale] };
        });

      fs.writeFileSync(cachePath, JSON.stringify({
        ...localeData,
        ui: uiLocalization[lang],
      }));

      console.log(`Generated ${cachePath}.`);
    }),
  );
};

entrypoint();
