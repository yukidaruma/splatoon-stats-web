import Vue from 'vue';
import Router from 'vue-router';

import Index from './components/Index.vue';
import Weapons from './components/Weapons.vue';
import Search from './components/Search.vue';
import PlayerSummary from './components/PlayerSummary.vue';
import XRankings from './components/XRankings.vue';

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
      path: '/rankings/:rankingType(x|league)',
      component: XRankings,
    },
    {
      path: '/search',
      component: Search,
    },
    {
      path: '/players/:defaultPlayerId?',
      component: PlayerSummary,
      props: true,
    },
  ],
});
