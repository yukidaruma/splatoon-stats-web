<template>
  <div>
    <div v-if="loading">
      Loading...
    </div>
    <div v-else-if="loaded">
      <h1>Records for player `<span class="player-id">{{ fetchedPlayerId }}</span>`</h1>

      <div>
        <h2 class="table-title">Known Names</h2>
        <div v-if="knownNames.length === 0">
          No known names found for player <span class="player-id">{{ fetchedPlayerId }}</span>
        </div>
        <ul v-else>
          <li v-for="knownName in knownNames" :key="knownName.name">
            <span class="player-name">{{ knownName.name }}</span> (<time>{{ knownName.last_used }}</time>)
          </li>
        </ul>

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
          <player-ranking-entry v-for="rankingEntry in playerRankingHistory.league" :key="`${rankingEntry.start_time}_${rankingEntry.group_type}`"
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
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '../api-client';
import { isValidPlayerId, formatRankingEntry } from '../helper';

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
      handler(playerId) {
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
      if (!isValidPlayerId(playerId)
        || playerId === this.fetchedPlayerId) { // Skip if the ID was already fetched
        return;
      }

      this.playerId = playerId;
      this.loading = true;
      this.loaded = false;

      Promise.all([
        apiClient.get(`/players/${playerId}/known_names`)
          .then((res) => { this.knownNames = res.data; }),
        ...['x', 'league', 'splatfest'].map(rankingType => apiClient.get(`/players/${playerId}/rankings/${rankingType}`).then((res) => {
          this.playerRankingHistory[rankingType] = res.data.map(rankingEntry => formatRankingEntry(rankingEntry, 'weapons'));
        })),
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
