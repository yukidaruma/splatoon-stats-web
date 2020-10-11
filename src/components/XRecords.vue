<template>
  <table class="table is-hoverable is-striped is-fullwidth">
    <tbody>
      <tr v-for="(record, i) in records" :key="i">
        <td>#{{ i + 1 }}</td>
        <td>{{ record.rating }}</td>
        <td>
          <div class="weapon-name-container">
            <weapon-icon-count :weapon-id="record.weapon_id" />
            <player-link :player="new Player(record.player_id, record.player_name)" />
          </div>
        </td>
        <td>
          <router-link :to="`/rankings/x/${record.year}/${record.month}/${findRuleKey(ruleId)}`">{{formatTime(record.start_time)}}</router-link>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import moment from 'moment';
import { findRuleKey } from '../helper';
import Player from '../player';
import PlayerLink from './PlayerLink.vue';
import WeaponIconCount from './WeaponIconCount.vue';

export default {
  components: { PlayerLink, WeaponIconCount },
  props: {
    records: Array,
    ruleId: Number,
  },
  methods: {
    findRuleKey,
    Player,
    formatTime(time) {
      return moment.utc(time).local().format('YYYY-MM');
    },
  },
};
</script>
