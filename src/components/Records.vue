<template>
  <div>
    <h2 class="table-title">X Ranked Weapon records</h2>
    <table>
      <thead>
        <tr>
          <th>Weapon</th>
          <th>Splat Zones</th>
          <th>Tower Control</th>
          <th>Rainmaker</th>
          <th>Clam Blitz</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="weapon in weapons" :key="weapon.weapon_id">
          <td>
            <div class="weapon-name-container">
              <img class="weapon-icon" :src="weapon.icon">{{ $t(weapon.namePath) }}
            </div>
          </td>
          <td v-for="(player, ruleId) in weapon.top_players" :key="`${weapon.weapon_id}-${ruleId}`">
            <div class="player" v-if="player">
              <p>{{ player.rating }}</p>
              <p><router-link :to="`/players/${player.player_id}`">{{ player.name }}</router-link></p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import moment from 'moment';

import apiClient from '../api-client';
import { formatRankingEntry } from '../helper';

export default {
  name: 'Records',
  data() {
    return {
      weapons: {},
    };
  },
  methods: {
    formatTime(time) {
      return moment.utc(time).local().format('YYYY-MM');
    },
    fetchWeaponsTopPlayers() {
      this.loading = true;

      apiClient
        .get('/weapons/x/top-players')
        .then((res) => {
          this.weapons = res.data.map(weapon => formatRankingEntry(weapon, 'weapons'));
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  created() {
    this.fetchWeaponsTopPlayers();
  },
};
</script>

<style scoped>
</style>
