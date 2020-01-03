<template>
  <div class="root-container">
    <h1 class="title">Records</h1>
    <h2 class="table-title">X Ranked Weapon records</h2>
    <div class="table-container">
      <table class="table is-hoverable is-striped is-fullwidth">
        <thead>
          <tr>
            <th><span class="is-hidden-mobile">Weapon</span></th>
            <th>{{ $t('rules.splat_zones.name') }}</th>
            <th>{{ $t('rules.tower_control.name') }}</th>
            <th>{{ $t('rules.rainmaker.name') }}</th>
            <th>{{ $t('rules.clam_blitz.name') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="weapon in weapons" :key="weapon.weapon_id">
            <td>
              <div class="weapon-name-container">
                <img class="weapon-icon" :src="weapon.icon">
                <span class="is-hidden-mobile">{{ $t(weapon.localizationKey) }}</span>
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
  </div>
</template>

<style scoped>
.weapon-icon {
  max-width: inherit;
}
@media screen and (max-width: 768px) {
  .root-container {
    position: relative;
  }
  .table-container {
    margin-left: 40px;
  }
  th:nth-child(1) {
    padding: 0;
  }
  td:nth-child(1) {
    border: 0;
    position: absolute;
    width: 40px;
    left: 0;
  }
}
</style>

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
      this.isLoading = true;

      apiClient
        .get('/weapons/x/top-players')
        .then((res) => {
          this.weapons = res.data.map(weapon => formatRankingEntry(weapon, 'weapons'));
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
  created() {
    this.fetchWeaponsTopPlayers();
  },
};
</script>

<style scoped>
@media screen and (min-width: 769px) {
  thead th:first-child {
    padding-left: 32px;
  }
}
</style>