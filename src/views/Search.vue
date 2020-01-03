<template>
  <div>
    <h1>Search players</h1>

    <div class="controls">
      <div>
        <span class="label">Player name</span>
        <input v-model="playerName" maxlength="10" placeholder="Yuki">
        <button @click="searchPlayersByName(playerName)" :disabled="isLoading">Find</button>
      </div>
      <div>
        <span class="label">Player ID</span>
        <input v-model="playerId" maxlength="16" placeholder="1234567890abcdef">
        <button @click="searchPlayerById(playerId)" :disabled="isLoading">Go</button>
      </div>
    </div>

    <div v-if="searchedName">
      <div v-if="isLoading">
        Loading...
      </div>

      <div class="search-result" v-else>
        <h2 class="table-title">Search Results</h2>
        <!--
          .is-mobile should not be necessary https://github.com/jgthms/bulma/issues/1807.
          Remove when it's fixed.
        -->
        <div class="columns is-mobile is-multiline" v-if="searchResults.length !== 0">
          <div class="column is-half-mobile is-one-quarter-tablet" v-for="player in searchResults" :key="`${player.player_id}-${player.player_name}`">
            <router-link class="player-name" :to="`/players/${player.player_id}`">{{ player.player_name }}</router-link>
            <time>({{ player.last_used }})</time>
          </div>
        </div>
        <div v-else>No players were found.</div>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '../api-client';

import { isValidPlayerId, isEmptyString } from '../helper';

export default {
  name: 'Search',
  data() {
    return {
      playerId: '',
      playerName: '',
      searchedName: '',
      isLoading: false,
      searchResults: [],
    };
  },
  created() {
    this.playerName = this.$route.query.name;
    this.searchPlayersByName(this.playerName);
  },
  methods: {
    searchPlayerById(playerId) {
      if (isValidPlayerId(playerId)) {
        this.$router.push(`/players/${playerId}`);
      } else {
        alert('Player ID must be 16-digit hexadecimal number.');
      }
    },
    searchPlayersByName(name) {
      if (!isEmptyString(name)) {
        this.isLoading = true;
        this.searchedName = name;

        this.$router.push(`/players/search?name=${name}`);
        apiClient.get(`/players/search?name=${name}`)
          .then((res) => {
            this.searchResults = res.data;
          })
          .finally(() => { this.isLoading = false; });
      }
    },
  },
};
</script>

<style scoped>
.search-result .player-name {
  font-weight: bold;
}
.search-result time {
  margin-left: .5em;
  font-size: 80%;
}

time {
  display: block;
}
</style>