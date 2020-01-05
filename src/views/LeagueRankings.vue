<template>
  <div>
    <h1 class="title">League Rankings</h1>

    <div class="controls">
      <div>
        <span class="label">Date</span>
        <date-picker initialRankingType="league" :showDate="true" v-model="time" />
      </div>
      <div>
        <span class="label">{{$t('ui.group_type')}}</span>
        <league-team-type-picker v-model="groupTypeId" :no-all="true" />

        <button @click="fetchLeagueRanking" :disabled="isLoading">Go</button>
      </div>
    </div>

    <h2 class="title table-title" v-if="title">
      League ranking for {{ title.time }}
    </h2>
    <ranking rankingType="league" :ranking="ranking" :isLoading="isLoading" />
  </div>
</template>

<script>
import moment from 'moment';

import apiClient from '../api-client';
import { formatRankingEntry } from '../helper';

import DatePicker from '../components/DatePicker.vue';
import LeagueTeamTypePicker, { LeagueTeamTypes } from '../components/LeagueTeamTypePicker.vue';
import Ranking from '../components/Ranking.vue';

const teamTypeSymbols = {
  [LeagueTeamTypes.team]: 'T',
  [LeagueTeamTypes.pair]: 'P',
};

export default {
  name: 'LeagueRankings',
  components: { DatePicker, LeagueTeamTypePicker, Ranking },
  props: ['initialLeagueId'],
  computed: {
    groupType() {
      return teamTypeSymbols[this.groupTypeId];
    },
  },
  data() {
    return {
      ranking: [],
      isLoading: false,
      time: undefined,
      groupTypeId: LeagueTeamTypes.team,
      title: null,
    };
  },
  methods: {
    fetchLeagueRanking() {
      const time = this.time;
      const leagueId = time.format('YYMMDDHH') + this.groupType;
      const path = `/rankings/league/${leagueId}`;

      this.title = null;
      this.isLoading = true;
      this.$router.push(path);

      apiClient.get(path)
        .then((res) => {
          this.ranking = res.data.map(rankingEntry => formatRankingEntry(rankingEntry, 'weapons'));
        })
        .finally(() => {
          this.title = {
            time: time.clone().local().format('YYYY/MM/DD HH:mm'),
          };
          this.isLoading = false;
        });
    },
  },
  created() {
    const leagueId = this.initialLeagueId;

    if (leagueId) {
      const groupType = leagueId.substr(leagueId.length - 1, 1);
      const leagueTime = moment.utc(leagueId.substr(0, leagueId.length - 1), 'YYMMDDHH', true);

      [this.groupTypeId] = Object.entries(teamTypeSymbols)
        .find(([_, v]) => v === groupType); // eslint-disable-line no-unused-vars

      if (leagueTime.isValid()) {
        this.time = leagueTime;
      }
    } else {
      this.time = moment.utc().startOf('day');
    }

    this.fetchLeagueRanking();
  },
};
</script>
