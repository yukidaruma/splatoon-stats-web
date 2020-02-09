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
                    <router-link :to="`/players/${rankingEntry.player_id}`">
                      <span class="player-name" v-if="'player_name' in rankingEntry">
                        {{ rankingEntry.player_name }}
                      </span>
                      <span class="player-id" v-else>
                        {{ rankingEntry.player_id }}
                      </span>
                    </router-link>
                  </div>
                </div>
                <div class="league-members" v-if="rankingType === 'league'">
                  <div class="league-member weapon-name-container" v-for="member in rankingEntry.group_members" :key="member.player_id">
                    <img class="weapon-icon" :src="weaponIcon('weapons', member[1])">
                    <router-link :to="`/players/${member[0]}`">
                      <span class="player-name" v-if="member[2]">
                        {{ member[2] }}
                      </span>
                      <span class="player-id" v-else>
                        {{ member[0] }}
                      </span>
                    </router-link>
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
import { weaponIcon } from '../helper';

export default {
  name: 'Ranking',
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
  methods: { weaponIcon },
  computed: {
    filteredRanking() {
      if (!Array.isArray(this.weaponFilter)) return this.ranking;

      return this.ranking.filter(record => this.weaponFilter.includes(record.weapon_id));
    },
  },
};
</script>
