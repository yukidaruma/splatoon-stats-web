<template>
  <div>
    <div v-if="isLoading">
      Loading...
    </div>
    <div v-else-if="hasLoaded">
      <h1 class="title">
        <span class="player-name" v-if="latestName">{{ latestName }}</span>
        <span v-else>ID: <span class="player-id">{{ fetchedPlayerId }}</span></span>
      </h1>

      <div v-if="chartData.length > 0">
        <h2 class="table-title">X Power</h2>
        <div class="chart-container">
          <x-ranked-chart :height="320" :chart-type="chartType" :data="chartData" :options="chartOptions" />
        </div>
        <div class="chart-controls">
          <label>Power <input type="radio" v-model="chartType" value="power"></label>
          <label>Rank <input type="radio" v-model="chartType" value="rank"></label>
        </div>
      </div>

      <div class="columns is-multiline">
        <div class="column is-half">
          <h2 class="table-title">X Ranked ({{ playerRankingHistory.x.length }})</h2>
          <div v-if="playerRankingHistory.x.length === 0">
            No X Ranked ranking record.
          </div>
          <table class="table is-hoverable is-striped is-fullwidth" v-else>
            <tbody>
              <player-ranking-entry v-for="rankingEntry in playerRankingHistory.x"
                rankingType="x"
                :key="`${rankingEntry.start_time}_${rankingEntry.rule_id}`"
                :rankingEntry="rankingEntry" />
            </tbody>
          </table>
        </div>

        <div class="column is-half">
          <h2 class="table-title">Splatfest ({{ playerRankingHistory.splatfest.length }})</h2>
          <div v-if="playerRankingHistory.splatfest.length === 0">
            No Splatfest ranking record.
          </div>
          <table class="table is-hoverable is-striped is-fullwidth">
            <tbody>
              <player-ranking-entry v-for="rankingEntry in playerRankingHistory.splatfest"
                rankingType="splatfest"
                :key="`${rankingEntry.region}-${rankingEntry.splatfest_id}`"
                :rankingEntry="rankingEntry" />
            </tbody>
          </table>
        </div>
      </div>

      <h2 class="table-title">League Battle ({{ playerRankingHistory.league.length }})</h2>
      <div v-if="playerRankingHistory.league.length === 0">
        No League Battle ranking record.
      </div>
      <table class="table is-hoverable is-striped is-fullwidth league">
        <tbody>
          <player-ranking-entry v-for="rankingEntry in playerRankingHistory.league"
            rankingType="league"
            :key="`${rankingEntry.start_time}_${rankingEntry.group_id}`"
            :rankingEntry="rankingEntry"
            :playerName="latestName ? latestName : fetchedPlayerId" />
        </tbody>
      </table>

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
import moment from 'moment';

import apiClient from '../api-client';
import { isValidPlayerId, formatRankingEntry } from '../helper';

import PlayerRankingEntry from '../components/PlayerRankingEntry.vue';
import XRankedChart from '../components/PlayerSummaryXRankedChart';

export default {
  name: 'Players',
  props: ['initialPlayerId'],
  components: { PlayerRankingEntry, XRankedChart },
  data() {
    return {
      playerId: '',
      fetchedPlayerId: '',
      hasLoaded: false,
      isLoading: false,
      playerRankingHistory: {},
      knownNames: [],

      // Properties used for chart
      chartData: [],
      chartType: 'power',
      chartOptions: {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        spanGaps: true,
        elements: {
          line: {
            tension: 0,
          },
        },
      },
    };
  },
  created() {
    if (isValidPlayerId(this.initialPlayerId)) {
      this.getPlayerRankingHistory(this.initialPlayerId);
    } else {
      this.$router.push('/players');
    }
  },
  watch: {
    '$route.params.initialPlayerId': {
      handler(playerId) {
        if (playerId) {
          this.getPlayerRankingHistory(playerId);
        } else {
          this.hasLoaded = false;
        }
      },
    },
  },
  computed: {
    latestName() {
      return this.knownNames[0] && this.knownNames[0].player_name;
    },
  },
  methods: {
    getPlayerRankingHistory(playerId) {
      if (!isValidPlayerId(playerId)
        || playerId === this.fetchedPlayerId) { // Skip if the ID was already fetched
        return;
      }

      this.playerId = playerId;
      this.isLoading = true;
      this.hasLoaded = false;

      Promise.all([
        apiClient.get(`/players/${playerId}/known_names`)
          .then((res) => { this.knownNames = res.data; }),
        ...['x', 'league', 'splatfest'].map(rankingType => apiClient.get(`/players/${playerId}/rankings/${rankingType}`).then((res) => {
          this.playerRankingHistory[rankingType] = res.data.map(rankingEntry => formatRankingEntry(rankingEntry, 'weapons'));

          if (rankingType === 'x') {
            this.chartData = res.data;
          }
        })),
      ])
        .then(() => {
          this.hasLoaded = true;
        })
        .finally(() => {
          this.$router.push(`/players/${playerId}`);
          this.fetchedPlayerId = this.playerId;
          this.isLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../assets/global-variables.scss';

.chart-container {
  height: 320px;
  background-color: $background;
}
.chart-controls {
  label:first-of-type {
    padding-right: 1em;
  }
  label, input {
    display: table-cell;
    vertical-align: middle
  }
}
.league, .league tbody {
  display: block;
}
.league tr {
  display: grid;
  width: 100%;
}
@media screen and (min-width: 960px) {
  .league tr {
    grid-template-columns: 3em 4em 1fr 7.5em 4em 12em;
  }
}
@media screen and (max-width: 959px) { /* TODO: use $tablet */
  .league tr {
    grid-template-columns: auto auto auto;
    /deep/ td:nth-child(1),
    /deep/ td:nth-child(2),
    /deep/ td:nth-child(3) {
      border: 0;
    }
  }
}
</style>
