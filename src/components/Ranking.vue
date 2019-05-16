<template>
  <div>
    <div v-if="loading">
      Loading...
    </div>
    <div v-else>
      <p v-if="ranking.length === 0">No data found.</p>
      <table v-else>
        <tr v-for="rankingEntry in ranking" :key="rankingEntry.rank">
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
            <div v-if="rankingType === 'league'">
              <div class="weapon-name-container" v-for="member in rankingEntry.group_members" :key="member.player_id">
                <img class="weapon-icon" :src="weaponIcon('weapons', member[1])">
                <router-link :to="`/players/${member[0]}`">
                  <span class="player-id">
                    {{ member[0] }}
                  </span>
                </router-link>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { weaponIcon } from '../helper';

export default {
  name: 'Ranking',
  props: ['rankingType', 'ranking', 'loading'],
  methods: { weaponIcon },
};
</script>
