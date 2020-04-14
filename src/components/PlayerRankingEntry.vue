<template>
  <tr>
    <td v-if="!asRecords">#{{ rankingEntry.rank }}</td>
    <td>{{ rankingEntry.rating }}</td>

    <!-- Weapon image -->
    <td v-if="rankingType === 'league'">
      <div class="league-members">
        <div v-if="playerName" class="league-member weapon-name-container">
          <img class="weapon-icon" :src="rankingEntry.icon">{{ playerName }}
        </div>
        <div class="league-member weapon-name-container" v-for="teammate in rankingEntry.teammates" :key="teammate.player_id">
          <img class="weapon-icon" :src="weaponIcon('weapons', teammate.weapon_id)">
          <player-link :player="new Player(teammate.player_id, teammate.player_name)" />
        </div>
      </div>
    </td>
    <td v-else>
      <div class="weapon-name-container">
        <img class="weapon-icon" :src="rankingEntry.icon">
        <span class="weapon-name">{{ $t(`weapons.${rankingEntry.weapon_id}.name`) }}</span>
      </div>
    </td>

    <!-- Time -->
    <td>
      <router-link :to="rankingPath(rankingType, rankingEntry)">
        <span v-if="rankingType === 'x'">{{ $t(`ui.rule_shortnames.${findRuleKey(rankingEntry.rule_id)}`) }}</span>
        <span v-else>{{ rankingEntry.start_time | formatDate(rankingType) }}</span>
      </router-link>
    </td>

    <td v-if="rankingType === 'league' && !asRecords">{{ $t(`ui.rule_shortnames.${findRuleKey(rankingEntry.rule_id)}`) }}</td>
    <td v-if="rankingType === 'league'">
      <div class="stage-names">
        <p class="stage-name">{{ $t(`stages.${rankingEntry.stage_ids[0]}.name`) }}</p>
        <p class="stage-name">{{ $t(`stages.${rankingEntry.stage_ids[1]}.name`) }}</p>
      </div>
    </td>
  </tr>
</template>

<script>
import moment from 'moment';
import { calculateEndTime, weaponIcon, findRuleKey } from '../helper';
import Player from '../player';

import PlayerLink from './PlayerLink.vue';

export default {
  components: { PlayerLink },
  name: 'PlayerRankingEntry',
  props: ['asRecords', 'playerName', 'rankingEntry', 'rankingType'],
  filters: {
    formatDate(time, rankingType) {
      const dateFormat = {
        x: 'YY-MM',
        league: 'YY-MM-DD HH:mm',
        splatfest: 'YYYY-MM-DD',
      }[rankingType];
      return moment.utc(time).local().format(dateFormat);
    },
  },
  methods: {
    calculateEndTime,
    findRuleKey,
    Player,
    weaponIcon,
    rankingPath(rankingType, rankingEntry) {
      const startTime = moment.utc(rankingEntry.start_time);
      let path = `/rankings/${rankingType}/`;

      if (rankingType === 'league') {
        path += startTime.format('YYMMDDHH') + rankingEntry.group_type;
      } else if (rankingType === 'x') {
        path += startTime.format('YYYY/M/') + findRuleKey(rankingEntry.rule_id);
      } else if (rankingType === 'splatfest') {
        path += `${rankingEntry.region}/${rankingEntry.splatfest_id}`;
      }

      return path;
    },
  },
};
</script>
