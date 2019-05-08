import Vue from 'vue';
import Router from 'vue-router';

import Index from './components/Index.vue';
import Weapons from './components/Weapons.vue';
import PlayerSummary from './components/PlayerSummary.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: Index,
    },
    {
      path: '/weapons',
      component: Weapons,
    },
    {
      path: '/players/:defaultPlayerId?',
      component: PlayerSummary,
      props: true,
    },
  ],
});
