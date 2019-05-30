<template>
  <div>
    <div class="controls">
      <span class="label">Splatfest</span>
      <splatfest-picker @splatfest-change="onSplatfestChange" />
      <button @click="selectedSplatfest && fetchSplatfestRanking(selectedSplatfest.region, selectedSplatfest.splatfest_id)">Go</button>
    </div>

    <div class="rankings" v-if="hasFetchedOnce">
      <div v-for="i in [0, 1]" :key="i"><!-- iterate over team_id -->
        <h2 class="table-title" :style="`color: ${lastFetchedSplatfest.colors[i]}`">{{ lastFetchedSplatfest.team_names[i] }}</h2>
        <ranking rankingType="splatfest" :ranking="rankings[i]" :isLoading="isLoading" />
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '../api-client';
import Ranking from './Ranking.vue';
import { formatRankingEntry } from '../helper';
import SplatfestPicker from './SplatfestPicker.vue';

export default {
  name: 'SplatfestRankings',
  components: { Ranking, SplatfestPicker },
  data() {
    return {
      selectedSplatfest: null,
      rankings: [[], []],
      lastFetchedSplatfest: null,
      currentRankingKey: '',
      isLoading: false,
    };
  },
  computed: {
    hasFetchedOnce() { return !!this.lastFetchedSplatfest; },
  },
  methods: {
    onSplatfestChange(splatfest, updateRanking) {
      this.selectedSplatfest = splatfest;
      if (updateRanking) {
        this.fetchSplatfestRanking(splatfest.region, splatfest.splatfest_id);
      }
    },
    fetchSplatfestRanking(region, splatfestId) {
      const path = `/rankings/splatfest/${region}/${splatfestId}`;
      this.isLoading = true;
      this.$router.push(path);

      apiClient.get(path)
        .then((res) => {
          this.currentRankingKey = `${region}-${splatfestId}`;

          const rankings = res.data;
          [0, 1].forEach((teamId) => {
            this.rankings[teamId] = rankings
              .filter(rankingEntry => rankingEntry.team_id === teamId)
              .map(rankingEntry => formatRankingEntry(rankingEntry, 'weapons'));
          });

          this.lastFetchedSplatfest = this.selectedSplatfest;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>

<style scoped>
.rankings {
  display: flex;
  flex-wrap: wrap;
}
.rankings > div {
  flex: 1;
  margin-right: 2em;
}
</style>
