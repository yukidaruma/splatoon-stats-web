// This code is based on @kazupon's vue-i18n sample code (Released under the MIT License)
// https://kazupon.github.io/vue-i18n/guide/lazy-loading.html

import Vue from 'vue';
import VueI18n from 'vue-i18n';

import apiClient from './api-client';

Vue.use(VueI18n);

export const i18n = new VueI18n({
  locale: 'en', // set locale
  fallbackLocale: 'en',
});

const loadedLanguages = [];

function setI18nLanguage(lang) {
  i18n.locale = lang;
  // axios.defaults.headers.common['Accept-Language'] = lang;
  document.querySelector('html').setAttribute('lang', lang);
  return lang;
}

export function loadLanguageAsync(lang, forceLoad = false) {
  if (forceLoad || i18n.locale !== lang) {
    if (!loadedLanguages.includes(lang)) {
      return apiClient.get(`/static/locale/${lang}.json`).then((res) => {
        i18n.setLocaleMessage(lang, res.data);
        loadedLanguages.push(lang);
        return setI18nLanguage(lang);
      });
    }
    return Promise.resolve(setI18nLanguage(lang));
  }
  return Promise.resolve(lang);
}
