<template>
  <div>
    <h1 class="title">Splatfest Rankings</h1>

    <div class="controls">
      <div>
        <span class="label">Splatfest</span>
        <splatfest-picker @splatfest-change="onSplatfestChange" />
        <button @click="selectedSplatfest && fetchSplatfestRanking(selectedSplatfest.region, selectedSplatfest.splatfest_id)">Go</button>
      </div>
      <div>
        <span class="label">Weapons</span>
        <weapon-picker :value.sync="filters.weapons" :options="weaponsUsed" :counts="weaponCounts" />
      </div>
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
          <ranking rankingType="splatfest" :ranking="rankings[i]" :isLoading="isLoading" :show-records-count="!!filters.weapons" :weapon-filter="filters.weapons" />
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
import flatten from 'array.prototype.flat';

import apiClient from '../api-client';
import { formatRankingEntry, titleizeSplatfest, unique } from '../helper';
import { weaponFilterQueryParamMixin } from './mixins';
import Ranking from '../components/Ranking.vue';
import SplatfestPicker from '../components/SplatfestPicker.vue';
import WeaponPicker from '../components/WeaponPicker.vue';

export default {
  mixins: [weaponFilterQueryParamMixin],
  name: 'SplatfestRankings',
  components: { Ranking, SplatfestPicker, WeaponPicker },
  data() {
    return {
      selectedSplatfest: null,
      rankings: [[], []],
      lastFetchedSplatfest: null,
      currentRankingKey: '',
      isLoading: false,
      filters: { weapons: null },
    };
  },
  computed: {
    hasFetchedOnce() { return !!this.lastFetchedSplatfest; },
    weaponPopularityPagePath() {
      if (this.lastFetchedSplatfest) {
        return `/weapons/weapons/splatfest/${this.lastFetchedSplatfest.region}/${this.lastFetchedSplatfest.splatfest_id}`;
      }
    },
    weaponCounts() {
      const counts = {};
      this.weaponIds.forEach((weaponId) => { counts[weaponId] = counts[weaponId] ? counts[weaponId] + 1 : 1; });
      return counts;
    },
    weaponIds() {
      return flatten(
        // #30 Use flatMap()
        this.rankings.map((records) => records.map((record) => record.weapon_id)),
      );
    },
    weaponsUsed() {
      return unique(this.weaponIds);
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
      let routePath = path;
      if (this.filters.weapons) {
        routePath += `?weapons=${this.filters.weapons.join(',')}`;
      }

      this.isLoading = true;
      this.$router.push(routePath);

      apiClient.get(path)
        .then((res) => {
          this.currentRankingKey = `${region}-${splatfestId}`;

          const rankings = res.data;
          this.rankings = new Array(2);
          [0, 1].forEach((teamId) => {
            this.rankings[teamId] = rankings
              .filter((rankingEntry) => rankingEntry.team_id === teamId)
              .map((rankingEntry) => formatRankingEntry(rankingEntry, 'weapons'));
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
