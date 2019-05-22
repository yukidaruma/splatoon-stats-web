<template>
  <div>
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
        <div>
          <ul v-if="searchResults.length !== 0">
            <li v-for="player in searchResults" :key="`${player.player_id}-${player.player_name}`">
              <router-link class="player-name" :to="`/players/${player.player_id}`">{{ player.player_name }}</router-link>
              <time>({{ player.last_used }})</time>
            </li>
          </ul>
          <p v-else>No players were found.</p>
        </div>
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
        alert('Invalid Player ID');
      }
    },
    searchPlayersByName(name) {
      if (!isEmptyString(name)) {
        this.isLoading = true;
        this.searchedName = name;

        this.$router.push(`search?name=${name}`);
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

ul {
  display: flex;
  flex-wrap: wrap;
}
li {
  list-style: none;
  width: 15em;
  margin: .5em;
}
time {
  display: block;
}
</style>
