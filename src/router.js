import Vue from 'vue';
import Router from 'vue-router';

import Index from './views/Index.vue';
import Weapons from './views/Weapons.vue';
import Records from './views/Records.vue';
import Search from './views/Search.vue';
import PlayerSummary from './views/PlayerSummary.vue';
import XRankings from './views/XRankings.vue';
import LeagueRankings from './views/LeagueRankings.vue';
import SplatfestRankings from './views/SplatfestRankings.vue';
import Trends from './views/Trends.vue';
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
      path: '/players',
      redirect: '/players/search',
    },
    {
      path: '/players/search',
      component: Search,
    },
    {
      path: '/players/:initialPlayerId?',
      component: PlayerSummary,
      props: true,
    },
    {
      path: '/rankings/league/:initialLeagueId(\\d{8}[TP])?',
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
      path: '/rankings/x',
      component: XRankings,
    },
    {
      path: `/rankings/x/:initialYear(\\d{4})/:initialMonth([1-9]|1[0-2])/:initialRankedRule(${rulePattern})`,
      component: XRankings,
      props: true,
    },
    {
      path: '/records',
      component: Records,
    },
    {
      path: '/trends',
      component: Trends,
      name: 'trendsDefault',
    },
    {
      path: `/trends/:weaponType(${weaponTypePattern})/:rankingType(x)/:rankedRule(${rulePattern})?`,
      component: Trends,
    },
    {
      path: `/trends/:weaponType(${weaponTypePattern})/:rankingType(x)/:rankedRule(${rulePattern})?`,
      component: Trends,
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
    { // Fallback route
      path: '*',
      redirect: '/',
    },
  ],
});
