<template>
  <div>
    <h1 class="title">Splatfest Rankings</h1>

    <div class="controls">
      <span class="label">Splatfest</span>
      <splatfest-picker @splatfest-change="onSplatfestChange" />
      <button @click="selectedSplatfest && fetchSplatfestRanking(selectedSplatfest.region, selectedSplatfest.splatfest_id)">Go</button>
    </div>

    <div v-if="hasFetchedOnce">
      <h2 class="title">Splatfest Ranking for {{ titleizeSplatfest(lastFetchedSplatfest) }}</h2>
      <p class="weapon-popularity-link">
        <router-link :to="weaponPopularityPagePath">
          Most used weapons in Splatfest: {{ titleizeSplatfest(lastFetchedSplatfest) }}
        </router-link>
      </p>

      <div class="columns is-multiline">
        <div :id="`team-${i}`" class="column is-half" v-for="i in [0, 1]" :key="i"><!-- iterate over team_id -->
          <div class="is-hidden-tablet">
            <a :href="`#team-${i ? 0 : 1}`">Jump to team {{ lastFetchedSplatfest.team_names[i ? 0 : 1] }}</a>
          </div>
          <h3 class="table-title" :style="{ 'background-color': lastFetchedSplatfest.colors[i] }">
            {{ lastFetchedSplatfest.team_names[i] }}
          </h3>
          <ranking rankingType="splatfest" :ranking="rankings[i]" :isLoading="isLoading" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/global-variables.scss';
@import '@/assets/helper-functions.scss';

.table-title {
  @include --text-stroke(1, invert($body-color));
}
</style>

<script>
import apiClient from '../api-client';
import { formatRankingEntry, titleizeSplatfest } from '../helper';
import Ranking from '../components/Ranking.vue';
import SplatfestPicker from '../components/SplatfestPicker.vue';

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
    weaponPopularityPagePath() {
      if (this.lastFetchedSplatfest) {
        return `/weapons/weapons/splatfest/${this.lastFetchedSplatfest.region}/${this.lastFetchedSplatfest.splatfest_id}`;
      }
    },
  },
  methods: {
    titleizeSplatfest,
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
.table-title {
  display: inline-block;
  padding: .25em;
}
</style>