import Vue from 'vue';
import Router from 'vue-router';

import Index from './components/Index.vue';
import Weapons from './components/Weapons.vue';
import Records from './components/Records.vue';
import Search from './components/Search.vue';
import PlayerSummary from './components/PlayerSummary.vue';
import XRankings from './components/XRankings.vue';
import LeagueRankings from './components/LeagueRankings.vue';
import SplatfestRankings from './components/SplatfestRankings.vue';
import { rankedRules } from './helper';

Vue.use(Router);

const weaponTypePattern = ['weapons', 'mains', 'specials', 'subs'].join('|');
const rulePattern = rankedRules.map(rule => rule.key).join('|');

export default new Router({
  linkActiveClass: 'is-active',
  mode: 'history',
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
      path: `/weapons/:weaponType(${weaponTypePattern})/:rankingType(x|league)/:year/:month/:rankedRule(${rulePattern})?`,
      component: Weapons,
    },
    {
      path: `/weapons/:weaponType(${weaponTypePattern})/:rankingType(splatfest)/:region/:splatfestId`,
      component: Weapons,
    },
    {
      path: '/records',
      component: Records,
    },
    {
      path: '/rankings/x',
      component: XRankings,
    },
    {
      path: `/rankings/x/:defaultYear(\\d{4})/:defaultMonth([1-9]|1[0-2])/:defaultRankedRule(${rulePattern})`,
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
    { // Falback route
      path: '*',
      component: Index,
      redirect: '/',
    },
  ],
});
