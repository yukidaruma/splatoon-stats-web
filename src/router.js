import Vue from 'vue';
import Router from 'vue-router';

import Index from './components/Index.vue';
import LeagueDatePicker from './components/LeagueDatePicker.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: Index,
    },
    {
      path: '/leagues',
      component: LeagueDatePicker,
    },
  ],
});
