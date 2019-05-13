import Vue from 'vue';
import Router from 'vue-router';

import Index from './components/Index.vue';
import Weapons from './components/Weapons.vue';
import Search from './components/Search.vue';
import PlayerSummary from './components/PlayerSummary.vue';
import XRankings from './components/XRankings.vue';
import LeagueRankings from './components/LeagueRankings.vue';
import { rankedRules } from './helper';

Vue.use(Router);

const rulesPattern = rankedRules.map(rule => rule.key).join('|');

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
      path: `/weapons/:weaponType/:rankingType/:year/:month/:rankedRule(${rulesPattern})?`,
      component: Weapons,
    },
    {
      path: '/rankings/x',
      component: XRankings,
    },
    {
      path: `/rankings/x/:defaultYear(\\d{4})/:defaultMonth([1-9]|1[0-2])/:defaultRankedRule(${rulesPattern})`,
      component: XRankings,
      props: true,
    },
    {
      path: '/rankings/league/:defaultLeagueId(\\d{8}[TP])?',
      component: LeagueRankings,
      props: true,
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
