<template>
  <div>
    <div v-if="isLoading">
      Loading...
    </div>
    <div v-else>
      <div class="title-container is-hidden-mobile">
        <h1 class="title">
          <span class="player-name" v-if="latestName">{{ latestName }}</span>
          <span v-else>ID: <span class="player-id">{{ fetchedPlayerId }}</span></span>
        </h1>
        <favorite-player-button class="favorite-player-button" :id="fetchedPlayerId" :name="latestName" />
      </div>
      <div class="is-hidden-tablet">
        <h1 class="title">
          <span class="player-name" v-if="latestName">{{ latestName }}</span>
          <span v-else>ID: <span class="player-id">{{ fetchedPlayerId }}</span></span>
        </h1>
        <favorite-player-button class="favorite-player-button" :id="fetchedPlayerId" :name="latestName" />
      </div>

      <div v-if="chartData.length > 0">
        <h2 class="table-title">X Power</h2>
        <div class="chart-container">
          <x-ranked-chart :height="320" :chart-type="chartType" :data="chartData" :options="chartOptions" :rule-filters.sync="filters.x.rules" :show-line="isLineVisible" />
        </div>
        <div class="chart-controls">
          <label><input type="radio" v-model="chartType" value="power"> Power</label>
          <label><input type="radio" v-model="chartType" value="rank"> Rank</label>
          <label><input type="checkbox" v-model="isLineVisible"> Show line</label>
        </div>
      </div>

      <div class="columns is-multiline">
        <div class="column is-half x">
          <div>
            <h2 class="is-inline-flex-desktop table-title">X Ranked ({{ xRankingRecordsCount }})</h2>
            <ranked-rule-picker v-if="playerRankingHistory.x.length"
              class="is-inline-flex-desktop inline-rule-picker"
              :type="RankedRulePickerTypes.checkbox"
              v-model="filters.x.rules" />
          </div>

          <div v-if="playerRankingHistory.x.length === 0">
            No X Ranked ranking record.
          </div>
          <div v-else>
            <div class="monthly-records" v-for="group in groupedXRankingHistory">
              <h3>{{ group.time }}</h3>
              <table class="table is-hoverable is-striped is-fullwidth">
                <tbody>
                  <player-ranking-entry v-for="rankingEntry in group.rankingEntries"
                    rankingType="x"
                    :key="rankingEntry.key"
                    :rankingEntry="rankingEntry" />
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="column is-half splatfest">
          <h2 class="table-title">Splatfest ({{ playerRankingHistory.splatfest.length }})</h2>

          <div v-if="playerRankingHistory.splatfest.length === 0">
            No Splatfest ranking record.
          </div>
          <table class="table is-hoverable is-striped is-fullwidth">
            <tbody>
              <player-ranking-entry v-for="rankingEntry in playerRankingHistory.splatfest"
                rankingType="splatfest"
                :key="rankingEntry.key"
                :rankingEntry="rankingEntry" />
            </tbody>
          </table>
        </div>
      </div>

      <div class="league">
        <div class="is-hidden-mobile">
          <h2 class="is-inline-flex-tablet table-title">League Battle ({{ filteredLeagueRankingEntryKeysSet.size }})</h2>
          <ranked-rule-picker
            v-if="playerRankingHistory.league.length > 0"
            class="is-inline-flex-tablet inline-rule-picker"
            :type="RankedRulePickerTypes.checkbox"
            v-model="filters.league.rules" />
        </div>
        <div class="is-hidden-tablet">
          <h2 class="table-title">League Battle ({{ filteredLeagueRankingEntryKeysSet.size }})</h2>
          <ranked-rule-picker
            class="rule-picker"
            :type="RankedRulePickerTypes.checkbox"
            v-model="filters.league.rules" />
        </div>

        <div v-if="playerRankingHistory.league.length === 0">
          No League Battle ranking record.
        </div>
        <div v-else>
          <div class="controls">
            <div class="align-center">
              <label class="label" for="league-group-type-picker">{{$t('ui.group_type')}}</label>
              <league-team-type-picker id="league-group-type-picker" class="league-group-type-picker" v-model="filters.league.teamType" />
            </div>
            <div>
              <label class="label" for="min-league-power-filter">{{$t('ui.min_power')}}</label>
              <input class="four-digits-num" id="min-league-power-filter"
                type="number" min="0" step="100" v-model="filters.league.minPower">
            </div>
            <div>
              <label class="label" for="min-league-rank-filter">{{$t('ui.min_rank')}}</label>
              <input class="four-digits-num" id="min-league-rank-filter"
                type="number" min="1" max="100" v-model="filters.league.minRank">
            </div>
            <div>
              <label class="label" for="min-league-rank-filter">Weapons</label>
              <weapon-picker :value.sync="filters.league.weapons" :options="weaponsUsedInLeague" :counts="leagueWeaponCounts" />
            </div>
          </div>
        </div>

        <table class="is-marginless table is-hoverable is-striped is-fullwidth">
          <tbody>
            <player-ranking-entry v-for="rankingEntry in playerRankingHistory.league"
              v-show="filteredLeagueRankingEntryKeysSet.has(rankingEntry.key)"
              ranking-type="league"
              :key="rankingEntry.key"
              :ranking-entry="rankingEntry"
              :player-name="latestName ? latestName : fetchedPlayerId" />
          </tbody>
        </table>
      </div>

      <h2 class="table-title">Peers ({{ peers.length }})</h2>
      <peers :peers="peers" />

      <h2 class="table-title">Known Names</h2>
      <div v-if="knownNames.length === 0">
        No known names found.
      </div>
      <ul v-else>
        <li v-for="knownName in knownNames" :key="knownName.player_name">
          <span class="player-name">{{ knownName.player_name }}</span> (<time>{{ knownName.last_used }}</time>)
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import flatten from 'array.prototype.flat';
import moment from 'moment';

import apiClient from '../api-client';
import { formatRankingEntry, isValidPlayerId, safeParseInt, unique, weaponIdsWithReskins } from '../helper';

import FavoritePlayerButton from '../components/FavoritePlayerButton.vue';
import LeagueTeamTypePicker, { LeagueTeamTypes } from '../components/LeagueTeamTypePicker.vue';
import Peers, { aggregateLeagueEntries } from '../components/Peers.vue';
import PlayerRankingEntry from '../components/PlayerRankingEntry.vue';
import RankedRulePicker, { DefaultSelectedRules, RankedRulePickerTypes } from '../components/RankedRulePicker.vue';
import WeaponPicker from '../components/WeaponPicker.vue';
import XRankedChart from '../components/PlayerSummaryXRankedChart';

const getInitialFilterState = () => ({
  league: {
    minPower: null,
    minRank: null,
    rules: DefaultSelectedRules.all,
    teamType: LeagueTeamTypes.all,
    weapons: null,
  },
  x: { rules: DefaultSelectedRules.all },
});

export default {
  name: 'Players',
  props: ['playerId'],
  components: {
    FavoritePlayerButton,
    LeagueTeamTypePicker,
    Peers,
    PlayerRankingEntry,
    RankedRulePicker,
    WeaponPicker,
    XRankedChart,
  },
  data() {
    return {
      fetchedPlayerId: '',
      isLoading: false,
      playerRankingHistory: {
        x: [],
        splatfest: [],
        league: [],
      },
      knownNames: [],

      // Properties used for chart
      chartData: [],
      chartType: 'power',
      chartOptions: {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        spanGaps: true,
        elements: { line: { tension: 0 } },
      },
      isLineVisible: false,
      RankedRulePickerTypes,
      filters: getInitialFilterState(),
    };
  },
  created() {
    if (isValidPlayerId(this.playerId)) {
      this.getPlayerRankingHistory(this.playerId);
    } else {
      this.$router.push('/players');
    }
  },
  watch: {
    '$route.params.playerId': {
      handler(playerId) {
        if (playerId) {
          this.filters = getInitialFilterState();
          this.getPlayerRankingHistory(playerId);
        }
      },
    },
  },
  computed: {
    filteredLeagueRankingEntryKeysSet() {
      return this.getFilteredLeagueRankingEntryKeysSet(this.playerRankingHistory.league, this.filters.league);
    },
    leagueFiltersWithoutWeapons() {
      return {
        minPower: this.filters.league.minPower,
        minRank: this.filters.league.minRank,
        rules: this.filters.league.rules,
        teamType: this.filters.league.teamType,
      };
    },
    groupedXRankingHistory() {
      const groupedXRankingHistory = [];

      if (!this.playerRankingHistory) {
        return [];
      }

      let lastMonth;
      this.playerRankingHistory.x.forEach((rankingEntry) => {
        if (!this.filters.x.rules.includes(rankingEntry.rule_id)) {
          return;
        }
        if (lastMonth !== rankingEntry.start_time) {
          groupedXRankingHistory.push({
            time: moment.utc(rankingEntry.start_time).format('YYYY-MM'),
            rankingEntries: [],
          });
        }
        groupedXRankingHistory[groupedXRankingHistory.length - 1].rankingEntries.push(rankingEntry);
        lastMonth = rankingEntry.start_time;
      });
      return groupedXRankingHistory;
    },
    latestName() {
      return this.knownNames[0] && this.knownNames[0].player_name;
    },
    leagueWeaponCounts() {
      const weaponIds = this.playerRankingHistory.league
        .filter((rankingEntry) => this.getFilteredLeagueRankingEntryKeysSet(
          this.playerRankingHistory.league,
          this.leagueFiltersWithoutWeapons,
          true,
        ).has(rankingEntry.key))
        .map((rankingEntry) => rankingEntry.weapon_id);

      const counts = {};
      weaponIds.forEach((weaponId) => { counts[weaponId] = counts[weaponId] ? counts[weaponId] + 1 : 1; });
      return counts;
    },
    peers() {
      return aggregateLeagueEntries(this.playerRankingHistory.league);
    },
    weaponsUsedInLeague() {
      return Array.from(
        unique(
          this.playerRankingHistory.league
            .filter((rankingEntry) => this.getFilteredLeagueRankingEntryKeysSet(
              this.playerRankingHistory.league,
              this.leagueFiltersWithoutWeapons,
            ).has(rankingEntry.key))
            .map((record) => record.weapon_id),
        ),
      );
    },
    xRankingRecordsCount() {
      return flatten(this.groupedXRankingHistory.map((g) => g.rankingEntries), 2).length;
    },
  },
  methods: {
    flatten,
    getFilteredLeagueRankingEntryKeysSet(records, filters, isForWeaponCount = false) {
      const minPower = safeParseInt(filters.minPower);
      const minRank = safeParseInt(filters.minRank);
      const weapons = filters.weapons ? new Set(weaponIdsWithReskins(filters.weapons)) : null;

      return new Set(
        records
          .filter((rankingEntry) => {
            if (filters.teamType === LeagueTeamTypes.team) {
              if (rankingEntry.group_type !== 'T') {
                return false;
              }
            } else if (filters.teamType === LeagueTeamTypes.pair) {
              if (rankingEntry.group_type !== 'P') {
                return false;
              }
            }

            if (rankingEntry.rating < minPower) {
              return false;
            }

            if (minRank && rankingEntry.rank > minRank) {
              return false;
            }

            if (!isForWeaponCount && filters.weapons && !weapons.has(rankingEntry.weapon_id)) {
              return false;
            }

            return filters.rules.includes(rankingEntry.rule_id);
          })
          .map((rankingEntry) => rankingEntry.key),
      );
    },
    async getPlayerRankingHistory(playerId) {
      if (!isValidPlayerId(playerId) || playerId === this.fetchedPlayerId) {
        // Skip if the ID was already fetched
        return;
      }

      this.playerId = playerId;
      this.isLoading = true;

      const { data } = await apiClient.get(`/players/${playerId}`);
      this.knownNames = data.names;
      Object.entries(data.rankings).forEach(([rankingType, rankings]) => {
        this.playerRankingHistory[rankingType] = rankings.map((rankingEntry) => formatRankingEntry(rankingEntry, 'weapons', rankingType));
      });
      this.chartData = data.rankings.x;

      this.fetchedPlayerId = this.playerId;
      this.isLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../assets/global-variables.scss';

.is-hidden-tablet .favorite-player-button {
  margin-bottom: 1em;
}
.is-hidden-mobile {
  &.title-container {
    display: flex;
    align-items: center;
  }
  .favorite-player-button {
    margin-left: 1em;
  }
}

.chart-container {
  height: 320px;
  background-color: $background;
}
.chart-controls {
  label:not(:first-of-type) {
    padding-left: 1em;
  }
  label, input {
    display: table-cell;
    vertical-align: middle
  }
}
.league .inline-rule-picker {
  margin-left: 1em;
}
@media screen and (min-width: 1024px) {
  .inline-rule-picker {
    margin-left: 1em;
  }
}
@media screen and (max-width: 1023px) {
  .inline-rule-picker {
    margin-bottom: 1em;
  }
}
.league, .x, .splatfest {
  tbody {
    display: block;
  }
  tr {
    display: grid;
    width: 100%;
  }
}
.league {
  .controls div:first-of-type {
    margin-top: 0;
  }

  tr {
    @media screen and (min-width: 960px) {
      grid-template-columns: 3em 4em 1fr 7.5em 4em 12em;
    }
    @media screen and (max-width: 959px) {
      grid-template-columns: auto auto auto;
      /deep/ td:nth-child(1),
      /deep/ td:nth-child(2),
      /deep/ td:nth-child(3) {
        border: 0;
      }
    }
  }
}
.x, .splatfest {
  .monthly-records:not(:first-child) {
    margin-top: 1em;
  }
  table {
    margin-top: .375em;
  }
  tr {
    display: grid;
    grid-template-columns: 2.5em 4em 1fr 6em;
    /deep/ td:nth-child(3) {
      overflow: hidden;
    }
  }
}
</style>
