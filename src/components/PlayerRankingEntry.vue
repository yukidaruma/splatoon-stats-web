<template>
  <tr>
    <td>#{{ rankingEntry.rank }}</td>
    <td>
      <div class="weapon-name-container">
        <img class="weapon-icon" :src="rankingEntry.icon">{{ $t(`weapons.${rankingEntry.weapon_id}.name`) }}
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
  </tr>
</template>

<script>
import moment from 'moment';
import { calculateEndTime, findRuleKey } from '../helper.js';

export default {
  name: 'PlayerRankingEntry',
  props: ['rankingEntry', 'rankingType'],
  methods: { calculateEndTime, findRuleKey },
  filters: {
    formatDate(time, rankingType) {
      const dateFormat = { x: 'YY-MM', league: 'YY-MM-DD hh:mm' }[rankingType];
      return moment.utc(time).format(dateFormat);
    },
  },
};
</script>

<style scoped>
.weapon-name-container {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}
</style>
