import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { i18n, loadLanguageAsync } from './i18n-setup';

Vue.config.productionTip = false;

loadLanguageAsync('en', true);

new Vue({
  i18n,
  router,
  render: h => h(App),
}).$mount('#app');
