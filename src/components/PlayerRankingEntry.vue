<template>
  <tr>
    <td>#{{ rankingEntry.rank }}</td>
    <td>
      <div class="weapon-name-container">
        <img class="weapon-icon" :src="rankingEntry.icon">{{ $t(rankingEntry.namePath) }}
      </div>
    </td>
    <td>{{ rankingEntry.rating }}</td>
    <td>
      {{ rankingEntry.start_time | formatDate(rankingType) }}
      <span v-if="rankingType === 'league'">
        ~ {{ calculateEndTime(rankingType, rankingEntry.start_time) | formatDate(rankingType) }}
      </span>
    </td>
    <td>{{ $t(`rules.${findRuleKey(rankingEntry.rule_id)}.name`) }}</td>
    <td v-if="rankingType === 'league'">
      {{ $t(`stages.${rankingEntry.stage_ids[0]}.name`) }},
      {{ $t(`stages.${rankingEntry.stage_ids[1]}.name`) }}
    </td>
    <td v-if="rankingType === 'league'">
      <p class="weapon-name-container" v-for="teammate in rankingEntry.teammates" :key="teammate.player_id">
        <img class="weapon-icon" :src="weaponIcon('weapons', teammate.weapon_id)">
        <router-link :to="`/players/${teammate.player_id}`" class="player-id">{{ teammate.player_id }}</router-link>
      </p>
    </td>
  </tr>
</template>

<script>
import moment from 'moment';
import { calculateEndTime, weaponIcon, findRuleKey } from '../helper';

export default {
  name: 'PlayerRankingEntry',
  props: ['rankingEntry', 'rankingType'],
  methods: { calculateEndTime, findRuleKey, weaponIcon },
  filters: {
    formatDate(time, rankingType) {
      const dateFormat = { x: 'YY-MM', league: 'YY-MM-DD hh:mm' }[rankingType];
      return moment.utc(time).format(dateFormat);
    },
  },
};
</script>

<style scoped>
</style>
