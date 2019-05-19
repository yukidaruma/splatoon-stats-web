import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { i18n, loadLanguageAsync } from './i18n-setup';

Vue.config.productionTip = false;

const browserLang = navigator.language.slice(0, 2);
loadLanguageAsync(browserLang, true);

new Vue({
  i18n,
  router,
  render: h => h(App),
}).$mount('#app');
