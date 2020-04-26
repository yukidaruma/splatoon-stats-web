<template>
  <div>
    <select v-model="regionFilter">
      <option :value="null">All regions</option>
      <option value="jp">JP</option>
      <option value="na">NA</option>
      <option value="eu">EU</option>
    </select>
    <select @change="emitSplatfestChange()" v-model="selectedSplatfest">
      <option :value="null">-</option>
      <option v-for="f in splatfestOptions" :key="f.key" :value="f">
        {{ titleizeSplatfest(f) }}
      </option>
    </select>
  </div>
</template>

<script>
import moment from 'moment';
import apiClient from '../api-client';
import { titleizeSplatfest } from '../helper';

export default {
  name: 'SplatfestPicker',
  data() {
    return {
      regionFilter: null,
      splatfests: [],
      selectedSplatfest: null,
    };
  },
  mounted() {
    apiClient.get('/splatfests')
      .then((res) => {
        this.splatfests = res.data
          .filter(splatfest => splatfest.end_time < moment.utc().format('YYYY-MM-DD HH:mm:ss'))
          .map((splatfest) => {
            splatfest.key = `${splatfest.region}-${splatfest.splatfest_id}`;
            return splatfest;
          });
      })
      .then(() => {
        const { region, splatfestId } = this.$route.params;
        if (region) {
          this.selectedSplatfest = this.splatfests.find(f => f.splatfest_id === Number(splatfestId) && f.region === region);
          this.emitSplatfestChange(true);
        }
      });
  },
  computed: {
    splatfestOptions() {
      if (this.regionFilter) {
        return this.splatfests.filter(splatfest => splatfest.region === this.regionFilter);
      }

      return this.splatfests;
    },
  },
  methods: {
    titleizeSplatfest,
    emitSplatfestChange(updateRanking = false) {
      this.$emit('splatfest-change', this.selectedSplatfest, updateRanking);
    },
  },
  watch: {
    regionFilter() {
      // Unselect if option is unavailable
      if (!this.splatfestOptions.includes(this.selectedSplatfest)) {
        this.selectedSplatfest = null;
      }
    },
  },
};
</script>
