<template>
  <table>
    <tr v-for="rankingEntry in ranking" :key="rankingEntry.rank">
      <td>#{{ rankingEntry.rank }}</td>
      <td>{{ rankingEntry.rating }}</td>
      <td>
        <div v-if="rankingType === 'x'">
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
</template>

<script>
import { weaponIcon } from '../helper';

export default {
  name: 'Ranking',
  props: ['rankingType', 'ranking'],
  methods: { weaponIcon },
};
</script>
