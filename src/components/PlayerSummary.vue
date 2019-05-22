<template>
  <div>
    <div v-if="isLoading">
      Loading...
    </div>
    <div v-else-if="hasLoaded">
      <h1>Records for player `<span class="player-id">{{ fetchedPlayerId }}</span>`</h1>

      <div>
        <div v-if="showXPowerChart">
          <h2 class="table-title">X Power</h2>
          <div class="chart-container">
            <x-ranked-chart :height="320" :data="chartData" :options="chartOptions" />
          </div>
        </div>

        <h2 class="table-title">X Ranked</h2>
        <div v-if="playerRankingHistory.x.length === 0">
          No X Ranked record found for player <span class="player-id">{{ fetchedPlayerId }}</span>
        </div>
        <table class="ranking" v-else>
          <player-ranking-entry v-for="rankingEntry in playerRankingHistory.x" :key="`${rankingEntry.start_time}_${rankingEntry.rule_id}`"
            rankingType="x" :rankingEntry="rankingEntry" />
        </table>

        <h2 class="table-title">League Battle</h2>
        <div v-if="playerRankingHistory.league.length === 0">
          No League Battle record found for player <span class="player-id">{{ fetchedPlayerId }}</span>
        </div>
        <table class="ranking">
          <player-ranking-entry v-for="rankingEntry in playerRankingHistory.league" :key="`${rankingEntry.start_time}_${rankingEntry.group_id}`"
            rankingType="league" :rankingEntry="rankingEntry" :playerName="knownNames[0] ? knownNames[0].name : fetchedPlayerId" />
        </table>

        <h2 class="table-title">Splatfest</h2>
        <div v-if="playerRankingHistory.splatfest.length === 0">
          No Splatfest record found for player <span class="player-id">{{ fetchedPlayerId }}</span>
        </div>
        <table class="ranking">
          <player-ranking-entry v-for="rankingEntry in playerRankingHistory.splatfest" :key="`${rankingEntry.region}-${rankingEntry.splatfest_id}`"
            rankingType="splatfest" :rankingEntry="rankingEntry" />
        </table>

        <h2 class="table-title">Known Names</h2>
        <div v-if="knownNames.length === 0">
          No known names found for player <span class="player-id">{{ fetchedPlayerId }}</span>
        </div>
        <ul v-else>
          <li v-for="knownName in knownNames" :key="knownName.name">
            <span class="player-name">{{ knownName.name }}</span> (<time>{{ knownName.last_used }}</time>)
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

import apiClient from '../api-client';
import { isValidPlayerId, formatRankingEntry } from '../helper';

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
            const ruleKeys = ['', 'splat_zones', 'tower_control', 'rainmaker', 'clam_blitz'];
            const firstAppeared = moment(res.data[res.data.length - 1].start_time);
            const lastAppeared = moment(res.data[0].start_time);
            const months = 1 + lastAppeared.diff(firstAppeared, 'month');
            const datasets = new Array(4).fill(null).map((_v, i) => {
              const dataset = {};
              const ruleId = i + 1;
              dataset.fill = false;
              dataset.label = this.$t(`rules.${ruleKeys[ruleId]}.name`);
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
  background-color: #34495e;
}
</style>
