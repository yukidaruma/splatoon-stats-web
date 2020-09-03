<template>
  <div>
    <div v-if="isLoading">
      Loading...
    </div>
    <div v-else>
      <p v-if="ranking.length === 0">No data found.</p>
      <div v-else>
        <template v-if="showRecordsCount">
          <p v-if="weaponFilter">{{ filteredRanking.length }} records ({{ranking.length}} before filter)</p>
          <p v-else>{{ ranking.length }} records</p>
        </template>
        <table class="table is-fullwidth is-striped is-hoverable">
          <tbody>
            <tr v-for="rankingEntry in filteredRanking" :key="rankingEntry.rank">
              <td>#{{ rankingEntry.rank }}</td>
              <td>{{ rankingEntry.rating }}</td>
              <td>
                <div v-if="rankingType === 'x' || rankingType === 'splatfest'">
                  <div class="weapon-name-container">
                    <img class="weapon-icon" :src="rankingEntry.icon">
                    <player-link :player="new Player(rankingEntry.player_id, rankingEntry.player_name)" />
                  </div>
                </div>
                <div class="league-members" v-if="rankingType === 'league'">
                  <div class="league-member weapon-name-container" v-for="member in rankingEntry.group_members" :key="member.player_id">
                    <img class="weapon-icon" :src="weaponIcon('weapons', member[1])">
                    <player-link :player="new Player(member[0], member[2])" />
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { weaponIcon, weaponIdsWithReskins } from '../helper';
import Player from '../player';

import PlayerLink from './PlayerLink.vue';

export default {
  name: 'Ranking',
  components: { PlayerLink },
  props: {
    isLoading: Boolean,
    ranking: Array,
    rankingType: String,
    showRecordsCount: {
      type: Boolean,
      default: true,
    },
    weaponFilter: Array,
  },
  methods: { Player, weaponIcon },
  computed: {
    filteredRanking() {
      let { weaponFilter: filters } = this;
      if (!Array.isArray(filters)) return this.ranking;

      filters = weaponIdsWithReskins(filters);

      if (this.rankingType === 'league') {
        return this.ranking.filter((team) => team.group_members
          .some((member) => filters.includes(parseInt(member[1], 10))));
      }

      return this.ranking.filter((record) => filters.includes(record.weapon_id));
    },
  },
};
</script>
