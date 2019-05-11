<template>
  <div>
    <div v-if="loading">
      Loading...
    </div>
    <div v-else-if="loaded">
      <h1>Records for player `<span class="player-id">{{ fetchedPlayerId }}</span>`</h1>

      <h2>Known Names</h2>
      <div v-if="knownNames.length === 0">
        No known names found for player <span class="player-id">{{ fetchedPlayerId }}</span>
      </div>
      <ul v-else>
        <li v-for="knownName in knownNames" :key="knownName">
          <span class="player-name">{{ knownName.name }}</span> (<date>{{ knownName.last_used }}</date>)
        </li>
      </ul>

      <h2>X Ranked</h2>
      <div v-if="playerRankingHistory.x.length === 0">
        No record found for player {{ fetchedPlayerId }}
      </div>
      <table v-else>
        <player-ranking-entry v-for="rankingEntry in playerRankingHistory.x" :key="`${rankingEntry.start_time}_${rankingEntry.rule_id}`"
          rankingType="x" :rankingEntry="rankingEntry" />
      </table>

      <h2>League Battle</h2>
      <div v-if="playerRankingHistory.league.length === 0">
        No record found for player {{ fetchedPlayerId }}
      </div>
      <table>
        <player-ranking-entry v-for="rankingEntry in playerRankingHistory.league" :key="`${rankingEntry.start_time}_${rankingEntry.group_type}`"
          rankingType="league" :rankingEntry="rankingEntry" />
      </table>
    </div>
  </div>
</template>

<script>
import apiClient from '../api-client';
import { isValidPlayerId, formatRankingEntry } from '../helper.js';

import PlayerRankingEntry from './PlayerRankingEntry.vue';

export default {
  name: 'Players',
  props: ['defaultPlayerId'],
  components: { PlayerRankingEntry },
  data() {
    return {
      playerId: '',
      fetchedPlayerId: '',
      loaded: false,
      loading: false,
      playerRankingHistory: {},
      knownNames: [],
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
      handler: function(playerId) {
        if (playerId) {
          this.getPlayerRankingHistory(playerId);
        } else {
          this.loaded = false;
        }
      },
    },
  },
  methods: {
    getPlayerRankingHistory(playerId) {
      if (!isValidPlayerId(playerId)) {
        alert('Invalid player id');
        return;
      } else if (playerId === this.fetchedPlayerId) { // Skip if the ID was already fetched
        return;
      }

      this.playerId = playerId;
      this.loading = true;
      this.loaded = false;

      Promise.all([
        apiClient.get(`/players/${playerId}/known_names`)
          .then((res) => this.knownNames = res.data),
        ...['x', 'league'].map(rankingType =>
          apiClient.get(`/players/${playerId}/rankings/${rankingType}`).then(res => {
            this.playerRankingHistory[rankingType] = res.data.map(weapon => formatRankingEntry(weapon, "weapons"));
          })
        )
      ])
        .then(() => {
          this.loaded = true;
        })
        .finally(() => {
          this.$router.push(`/players/${playerId}`);
          this.fetchedPlayerId = this.playerId;
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>
</style>
