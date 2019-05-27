<template>
  <select @change="emitSplatfestChange()" v-model="selectedSplatfest">
    <option :value="null">-</option>
    <option v-for="f in splatfests" :key="f.key" :value="f">
      [{{ f.region | capitalize }}] {{ f.team_names.join(' VS ') }}
    </option>
  </select>
</template>

<script>
import apiClient from '../api-client';

export default {
  name: 'SplatfestPicker',
  data() {
    return {
      splatfests: [],
      selectedSplatfest: null,
    };
  },
  mounted() {
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
          this.emitSplatfestChange(true);
        }
      });
  },
  methods: {
    emitSplatfestChange(updateRanking = false) {
      this.$emit('splatfest-change', this.selectedSplatfest, updateRanking);
    },
  },
  filters: {
    capitalize: str => str.toUpperCase(),
  },
};
</script>
