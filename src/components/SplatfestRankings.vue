<template>
  <div>
    <div class="controls">
      <div>
        <span class="label">Splatfest</span>
        <select v-model="selectedSplatfest">
          <option :value="null">-</option>
          <option v-for="f in splatfests" :key="f.key" :value="f"
            :class="f.key === currentRankingKey ? 'active' : ''">
              [{{ f.region | capitalize }}] {{ f.team_names.join(' VS ') }}
          </option>
        </select>
        <button @click="selectedSplatfest && fetchSplatfestRanking(selectedSplatfest.region, selectedSplatfest.splatfest_id)">Go</button>
      </div>
    </div>

    <div class="rankings" v-if="hasFetchedOnce">
      <div v-for="i in [0, 1]" :key="i"><!-- iterate over team_id -->
        <h2 class="table-title" :style="`color: ${lastFetchedSplatfest.colors[i]}`">{{ lastFetchedSplatfest.team_names[i] }}</h2>
        <ranking rankingType="splatfest" :ranking="rankings[i]" :loading="loading" />
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '../api-client';
import Ranking from './Ranking.vue';
import { formatRankingEntry } from '../helper';

export default {
  name: 'SplatfestRankings',
  components: { Ranking },
  data() {
    return {
      selectedSplatfest: null,
      splatfests: [],
      rankings: [[], []],
      lastFetchedSplatfest: null,
      currentRankingKey: '',
      loading: false,
    };
  },
  computed: {
    hasFetchedOnce() { return !!this.lastFetchedSplatfest; },
  },
  created() {
    apiClient.get('/splatfests')
      .then((res) => {
        this.splatfests = res.data.map((splatfest) => {
          splatfest.key = `${splatfest.region}-${splatfest.splatfest_id}`;
          return splatfest;
        });
      })
      .then(() => {
        const { region, splatfestId } = this.$route.params;
        if (region) {
          this.selectedSplatfest = this.splatfests.find(f => f.splatfest_id === Number(splatfestId) && f.region === region);
          this.fetchSplatfestRanking(this.selectedSplatfest.region, this.selectedSplatfest.splatfest_id);
        }
      });
  },
  methods: {
    fetchSplatfestRanking(region, splatfestId) {
      const path = `/rankings/splatfest/${region}/${splatfestId}`;
      this.loading = true;
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
          this.loading = false;
        });
    },
  },
  filters: {
    capitalize: str => str.toUpperCase(),
  },
};
</script>

<style scoped>
.rankings {
  display: flex;
}
.rankings > div {
  width: 50%;
  margin-right: 2em;
}
</style>
