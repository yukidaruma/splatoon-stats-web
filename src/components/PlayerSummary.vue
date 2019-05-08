<template>
  <div>
    <div>
      Player ID: <input v-model="playerId" maxlength="16" placeholder="1234567890abcdef">
      <button @click="getPlayerRankingHistory" :disabled="loading">Go</button>
    </div>

    <div v-if="loading">
      Loading...
    </div>
    <div v-else-if="loaded">
      <h1>Records for player `{{ fetchedPlayerId }}`</h1>

      <h2>X Ranked</h2>
      <div v-if="playerRankingHistory.x.length === 0">
        No record found for player {{ fetchedPlayerId }}
      </div>
      <table v-else>
        <player-ranking-entry v-for="rankingEntry in playerRankingHistory.x" :key="rankingEntry.start_time"
          rankingType="x" :rankingEntry="rankingEntry" />
      </table>

      <h2>League Battle</h2>
      <table>
        <player-ranking-entry v-for="rankingEntry in playerRankingHistory.league" :key="rankingEntry.start_time"
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
    };
  },
  created() {
    if (isValidPlayerId(this.defaultPlayerId)) {
      this.playerId = this.defaultPlayerId;
      this.getPlayerRankingHistory();
    } else {
      this.$router.push('/players');
    }
  },
  methods: {
    getPlayerRankingHistory() {
      const { playerId } = this;

      if (!isValidPlayerId(playerId)) {
        alert('Invalid player id');
        return;
      } if (playerId === this.fetchedPlayerId) { // Skip if the ID was already fetched
        return;
      }

      this.loading = true;
      this.loaded = false;

      Promise.all(['x', 'league'].map(rankingType => apiClient.get(`/${rankingType}/players/${playerId}`)
        .then((res) => {
          this.playerRankingHistory[rankingType] = res.data.map(weapon => formatRankingEntry(weapon, 'weapons'));
        })))
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
