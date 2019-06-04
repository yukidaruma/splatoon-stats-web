<template>
  <div>
    <div v-if="isLoading">
      Loading...
    </div>
    <div v-else-if="hasLoaded">
      <h1>Records for player <span class="player-id">{{ fetchedPlayerId }}</span></h1>

      <div v-if="showXPowerChart">
        <h2 class="table-title">X Power</h2>
        <div class="chart-container">
          <x-ranked-chart :height="320" :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <div class="columns is-multiline">
        <div class="column is-half">
          <h2 class="table-title">X Ranked ({{ playerRankingHistory.x.length }})</h2>
          <div v-if="playerRankingHistory.x.length === 0">
            No X Ranked ranking record.
          </div>
          <table class="table is-hoverable is-fullwidth" v-else>
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
          <table class="table is-hoverable is-fullwidth">
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
      <table class="table is-hoverable is-fullwidth league">
        <tbody>
          <player-ranking-entry v-for="rankingEntry in playerRankingHistory.league"
            rankingType="league"
            :key="`${rankingEntry.start_time}_${rankingEntry.group_id}`"
            :rankingEntry="rankingEntry"
            :playerName="knownNames[0] ? knownNames[0].player_name : fetchedPlayerId" />
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
import { isValidPlayerId, formatRankingEntry, findRuleKey } from '../helper';

import PlayerRankingEntry from './PlayerRankingEntry.vue';
import XRankedChart from './PlayerSummaryXRankedChart';

export default {
  name: 'Players',
  props: ['defaultPlayerId'],
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
      showXPowerChart: false,
      chartData: [],
      chartOptions: {
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
    if (isValidPlayerId(this.defaultPlayerId)) {
      this.getPlayerRankingHistory(this.defaultPlayerId);
    } else {
      this.$router.push('/players');
    }
  },
  watch: {
    '$route.params.defaultPlayerId': {
      handler(playerId) {
        if (playerId) {
          this.getPlayerRankingHistory(playerId);
        } else {
          this.hasLoaded = false;
        }
      },
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
            if (res.data.length === 0) {
              this.showXPowerChart = false;
              return;
            }

            this.showXPowerChart = true;
            const chartColors = ['#e74c3c', '#2ecc71', '#3498db', '#f1c40f'];
            const firstAppeared = moment(res.data[res.data.length - 1].start_time);
            const lastAppeared = moment(res.data[0].start_time);
            const months = 1 + lastAppeared.diff(firstAppeared, 'month');
            const datasets = new Array(4).fill(null).map((_v, i) => {
              const dataset = {};
              const ruleId = i + 1;
              dataset.fill = false;
              dataset.label = this.$t(`rules.${findRuleKey(ruleId)}.name`);
              dataset.borderColor = dataset.backgroundColor = chartColors[i];
              if (res.data.some(row => ruleId === row.rule_id)) {
                dataset.data = new Array(months).fill(null);
              }
              return dataset;
            });
            const xAxesLabels = [];
            [...Array(months)].map((_, i) => {
              xAxesLabels.push(firstAppeared.clone().add({ month: i }).format('YY-MM'));
            });
            this.chartData = {
              datasets,
              labels: xAxesLabels,
            };

            Array.from(res.data).reverse().forEach((row) => {
              const i = moment(row.start_time).diff(firstAppeared, 'month');
              datasets[row.rule_id - 1].data[i] = row.rating;
            });
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

<style scoped>
.chart-container {
  height: 320px;
  background-color: #34495e; /* TODO: use $background-color */
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
  }
  .league tr >>> td:nth-child(1),
  .league tr >>> td:nth-child(2),
  .league tr >>> td:nth-child(3) {
    border: 0;
  }
}
</style>
