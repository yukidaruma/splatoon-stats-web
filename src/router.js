import Vue from 'vue';
import Router from 'vue-router';

import Index from './components/Index.vue';
import Weapons from './components/Weapons.vue';
import WeaponTopPlayers from './components/WeaponTopPlayers.vue';
import Search from './components/Search.vue';
import PlayerSummary from './components/PlayerSummary.vue';
import XRankings from './components/XRankings.vue';
import LeagueRankings from './components/LeagueRankings.vue';
import SplatfestRankings from './components/SplatfestRankings.vue';
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
      path: '/weapons/top-players',
      component: WeaponTopPlayers,
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
      path: '/rankings/splatfest',
      component: SplatfestRankings,
    },
    {
      path: '/rankings/splatfest/:region(na|eu|jp)/:splatfestId(\\d+)',
      component: SplatfestRankings,
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
