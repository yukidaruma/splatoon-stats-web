<template>
  <div>
    <div>
      Date:
      <date-picker defaultRankingType="league" showDate="true"
        :defaultYear="time.year()" :defaultMonth="time.month()" :defaultDate="time.date()" :defaultHour="time.hour()"
        @time-change="onTimeChange" />
    </div>
    <div>
      Group type:
      <select v-model="groupType">
        <option value="T">Team</option>
        <option value="P">Pair</option>
      </select>

      <button @click="fetchLeagueRanking" :disabled="loading">Go</button>
    </div>

    <ranking rankingType="league" :ranking="ranking" :loading="loading" />
  </div>
</template>

<script>
import moment from 'moment';

import apiClient from '../api-client';
import DatePicker from './DatePicker.vue';
import Ranking from './Ranking.vue';
import { formatRankingEntry } from '../helper';

export default {
  name: 'LeagueRankings',
  components: { DatePicker, Ranking },
  props: ['defaultLeagueId'],
  data() {
    return {
      ranking: [],
      loading: false,
      time: undefined,
      groupType: 'T',
    };
  },
  methods: {
    fetchLeagueRanking() {
      const leagueId = this.time.format(`YYMMDDHH`) + this.groupType;
      const path = `/rankings/league/${leagueId}`;

      this.loading = true;
      this.$router.push(path);
      apiClient.get(path)
        .then((res) => {
          this.ranking = res.data.map(weapon => formatRankingEntry(weapon, 'weapons'));
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onTimeChange(time) {
      this.time = time;
    },
    onGroupTypeChange(groupType) {
      this.groupType = groupType;
    },
  },
  created() {
    const leagueId = this.defaultLeagueId;

    if (leagueId) {
      const groupType = leagueId.substr(leagueId.length - 1, 1);
      const leagueTime = moment.utc(leagueId.substr(0, leagueId.length - 1), 'YYMMDDHH', true);

      this.groupType = this.groupType;
      if (leagueTime.isValid()) {
        this.time = leagueTime;
      }
    } else {
      this.time = moment.utc().hour(0);
    }

    this.fetchLeagueRanking();
  },
};
</script>
